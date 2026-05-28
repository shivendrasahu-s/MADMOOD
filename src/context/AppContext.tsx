import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCart,
  addToCart as dbAddToCart,
  updateCartItemQuantity as dbUpdateQty,
  getCurrentSessionUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserWishlist,
  clearCart,
  getStoredData,
  setStoredData,
  updateUserProfileFields,
  saveOTP,
  verifyOTP,
  sendEmail,
  sendSMS
} from '../services/db';
import type { CartItem, User } from '../services/db';
import { auth, db, isFirebaseEnabled } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AppContextType {
  cart: CartItem[];
  cartCount: number;
  wishlist: string[];
  currentUser: User | null;
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  addItemToCart: (id: string, qty: number, size: string) => void;
  removeItemFromCart: (id: string, size: string) => void;
  updateItemQty: (id: string, size: string, qty: number) => void;
  userLogin: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  userRegister: (email: string, first: string, last: string, password?: string) => Promise<{ success: boolean; message: string }>;
  userLogout: () => Promise<void>;
  toggleWishlist: (id: string) => boolean;
  refreshUser: () => void;
  clearAllCart: () => void;
  googleLogin: () => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  sendEmailOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmailOTP: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  sendPhoneOTP: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyPhoneOTP: (phone: string, code: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (fields: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Initial load & Auth Listener
  useEffect(() => {
    setCart(getCart());
    
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && firebaseUser.email) {
          const email = firebaseUser.email.toLowerCase().trim();
          localStorage.setItem('mmi_session_user', email);
          
          try {
            // Get/Create user document in Firestore
            const userDocRef = doc(db, 'users', email);
            const userDocSnap = await getDoc(userDocRef);
            
            let userData: User;
            if (userDocSnap.exists()) {
              userData = userDocSnap.data() as User;
            } else {
              const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : ['MAD', 'Customer'];
              userData = {
                email,
                firstName: nameParts[0] || 'MAD',
                lastName: nameParts.slice(1).join(' ') || 'Customer',
                addresses: [],
                wishlist: []
              };
              await setDoc(userDocRef, userData);
            }
            
            // Sync to local
            const localUsers = getStoredData<Record<string, User>>('mmi_users', {});
            localUsers[email] = userData;
            setStoredData('mmi_users', localUsers);
            
            setCurrentUser(userData);
            setWishlist(userData.wishlist || []);
          } catch (e) {
            console.error('Error fetching Firestore user profiles:', e);
            // Fallback to local session
            const user = getCurrentSessionUser();
            setCurrentUser(user);
            if (user) setWishlist(user.wishlist || []);
          }
        } else {
          localStorage.removeItem('mmi_session_user');
          setCurrentUser(null);
          setWishlist([]);
        }
      });
      return () => unsubscribe();
    } else {
      const user = getCurrentSessionUser();
      setCurrentUser(user);
      if (user) {
        setWishlist(user.wishlist || []);
      }
    }
  }, []);

  const refreshUser = () => {
    const user = getCurrentSessionUser();
    setCurrentUser(user);
    if (user) {
      setWishlist(user.wishlist || []);
    } else {
      setWishlist([]);
    }
  };

  const addItemToCart = (id: string, qty: number, size: string) => {
    const updated = dbAddToCart(id, qty, size);
    setCart(updated);
    setCartOpen(true); // Open cart immediately when item added for premium experience
  };

  const removeItemFromCart = (id: string, size: string) => {
    const updated = dbUpdateQty(id, size, 0);
    setCart(updated);
  };

  const updateItemQty = (id: string, size: string, qty: number) => {
    const updated = dbUpdateQty(id, size, qty);
    setCart(updated);
  };

  const userLogin = async (email: string, password?: string) => {
    if (isFirebaseEnabled && auth) {
      try {
        const cleanEmail = email.toLowerCase().trim();
        const pswd = password || 'dummy_password_123';
        await signInWithEmailAndPassword(auth, cleanEmail, pswd);
        // User state will update via listener
        return { success: true, message: 'Login successful.' };
      } catch (error: any) {
        console.error('Firebase sign-in error:', error);
        return { success: false, message: error.message || 'Login failed. Please check your credentials.' };
      }
    } else {
      const res = loginUser(email);
      if (res.success) {
        refreshUser();
      }
      return res;
    }
  };

  const userRegister = async (email: string, first: string, last: string, password?: string) => {
    if (isFirebaseEnabled && auth) {
      try {
        const cleanEmail = email.toLowerCase().trim();
        const pswd = password || 'dummy_password_123';
        await createUserWithEmailAndPassword(auth, cleanEmail, pswd);
        
        const newUser: User = {
          email: cleanEmail,
          firstName: first,
          lastName: last,
          addresses: [],
          wishlist: []
        };
        await setDoc(doc(db, 'users', cleanEmail), newUser);
        
        const localUsers = getStoredData<Record<string, User>>('mmi_users', {});
        localUsers[cleanEmail] = newUser;
        setStoredData('mmi_users', localUsers);

        return { success: true, message: 'Registration successful.' };
      } catch (error: any) {
        console.error('Firebase registration error:', error);
        return { success: false, message: error.message || 'Registration failed.' };
      }
    } else {
      const res = registerUser(email, first, last);
      if (res.success) {
        refreshUser();
      }
      return res;
    }
  };

  const googleLogin = async () => {
    if (isFirebaseEnabled && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        if (user && user.email) {
          const email = user.email.toLowerCase().trim();
          const nameParts = user.displayName ? user.displayName.split(' ') : ['MAD', 'Customer'];
          const first = nameParts[0] || 'MAD';
          const last = nameParts.slice(1).join(' ') || 'Customer';
          
          const userDocRef = doc(db, 'users', email);
          const userDocSnap = await getDoc(userDocRef);
          
          let userData: User;
          if (userDocSnap.exists()) {
            userData = userDocSnap.data() as User;
          } else {
            userData = {
              email,
              firstName: first,
              lastName: last,
              addresses: [],
              wishlist: []
            };
            await setDoc(userDocRef, userData);
          }
          
          const localUsers = getStoredData<Record<string, User>>('mmi_users', {});
          localUsers[email] = userData;
          setStoredData('mmi_users', localUsers);
          
          refreshUser();
          return { success: true, message: 'Google Login successful.' };
        }
        return { success: false, message: 'Failed to extract email from Google profile.' };
      } catch (error: any) {
        console.error('Firebase Google Sign-In error:', error);
        return { success: false, message: error.message || 'Google Sign-In failed.' };
      }
    } else {
      // Fallback mock
      registerUser('customer.demo@madmood.in', 'Vikram', 'Malhotra');
      loginUser('customer.demo@madmood.in');
      refreshUser();
      return { success: true, message: 'Simulated Google Login successful.' };
    }
  };

  const userLogout = async () => {
    if (isFirebaseEnabled && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Error signing out from Firebase Auth:', e);
      }
    }
    logoutUser();
    setCurrentUser(null);
    setWishlist([]);
  };

  const forgotPassword = async (email: string) => {
    if (isFirebaseEnabled && auth) {
      try {
        await sendPasswordResetEmail(auth, email.toLowerCase().trim());
        return { success: true, message: 'A password reset link has been dispatched to your email.' };
      } catch (error: any) {
        console.error('Firebase Password Reset error:', error);
        return { success: false, message: error.message || 'Failed to dispatch reset email.' };
      }
    } else {
      return { success: true, message: 'PASSWORD RESET SENT: A recovery link has been transmitted to your email address.' };
    }
  };

  const sendEmailOTP = async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await saveOTP(email, code);
    
    const emailHtml = `
      <div style="background-color: #000000; color: #ffffff; font-family: 'Outfit', Arial, sans-serif; padding: 40px; max-width: 500px; margin: 0 auto; border: 1px solid #111; text-align: center;">
        <h1 style="letter-spacing: 0.25em; font-weight: 900; margin: 0; color: #ffffff; font-size: 24px;">MAD <span style="color: #ff0d2b;">MOOD</span></h1>
        <p style="font-size: 8px; color: #a3a3a3; letter-spacing: 0.15em; margin: 5px 0 30px 0; text-transform: uppercase;">Identity Verification System</p>
        
        <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 10px; text-transform: uppercase;">Verify Your Email Address</h2>
        <p style="color: #a3a3a3; font-size: 13px; line-height: 1.6; margin-bottom: 30px;">Use the security code below to complete your email verification. This code is active for 5 minutes.</p>
        
        <div style="background-color: #050505; border: 1px solid #ff0d2b; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 0.2em; color: #ff0d2b; display: inline-block; margin-bottom: 30px;">
          ${code}
        </div>
        
        <p style="font-size: 11px; color: #555555; line-height: 1.5; border-top: 1px solid #111; padding-top: 20px;">
          If you did not initiate this request, please contact our direct security support immediately at +91 6386376901.
        </p>
      </div>
    `;
    await sendEmail(email, 'MAD MOOD: EMAIL VERIFICATION SECURITY CODE', emailHtml);
    return { success: true, message: 'OTP sent to your email.' };
  };

  const verifyEmailOTP = async (email: string, code: string) => {
    const isValid = await verifyOTP(email, code);
    if (isValid) {
      const updatedUser = await updateUserProfileFields(email, { isEmailVerified: true });
      const users = getStoredData<Record<string, User>>('mmi_users', {});
      users[email] = updatedUser;
      setStoredData('mmi_users', users);
      
      refreshUser();
      return { success: true, message: 'Email verified successfully.' };
    }
    return { success: false, message: 'Invalid or expired OTP code.' };
  };

  const sendPhoneOTP = async (phone: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await saveOTP(phone, code);
    sendSMS(phone, `[MAD MOOD] Your phone verification security code is: ${code}. Valid for 5 minutes.`);
    return { success: true, message: 'OTP sent to your phone number.' };
  };

  const verifyPhoneOTP = async (phone: string, code: string) => {
    const isValid = await verifyOTP(phone, code);
    if (isValid) {
      if (!currentUser) return { success: false, message: 'Authentication required.' };
      
      const updatedUser = await updateUserProfileFields(currentUser.email, { isPhoneVerified: true, phone });
      const users = getStoredData<Record<string, User>>('mmi_users', {});
      users[currentUser.email] = updatedUser;
      setStoredData('mmi_users', users);
      
      refreshUser();
      return { success: true, message: 'Phone number verified successfully.' };
    }
    return { success: false, message: 'Invalid or expired OTP code.' };
  };

  const updateUserProfile = async (fields: Partial<User>) => {
    if (!currentUser) return { success: false, message: 'Authentication required.' };
    
    try {
      const updatedUser = await updateUserProfileFields(currentUser.email, fields);
      const users = getStoredData<Record<string, User>>('mmi_users', {});
      users[currentUser.email] = updatedUser;
      setStoredData('mmi_users', users);
      
      refreshUser();
      return { success: true, message: 'Profile completed successfully.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to update profile.' };
    }
  };

  const toggleWishlist = (id: string): boolean => {
    if (!currentUser) {
      return false; // must be logged in
    }
    const res = updateUserWishlist(id);
    refreshUser();
    
    // Sync wishlist changes to Firestore if enabled
    if (isFirebaseEnabled && db) {
      const email = currentUser.email.toLowerCase().trim();
      const updatedWishlist = wishlist.includes(id)
        ? wishlist.filter(item => item !== id)
        : [...wishlist, id];
      setDoc(doc(db, 'users', email), { wishlist: updatedWishlist }, { merge: true })
        .catch(err => console.error('Firestore wishlist sync error:', err));
    }
    
    return res.active;
  };

  const clearAllCart = () => {
    clearCart();
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        cartCount,
        wishlist,
        currentUser,
        cartOpen,
        searchOpen,
        setCartOpen,
        setSearchOpen,
        addItemToCart,
        removeItemFromCart,
        updateItemQty,
        userLogin,
        userRegister,
        userLogout,
        toggleWishlist,
        refreshUser,
        clearAllCart,
        googleLogin,
        forgotPassword,
        sendEmailOTP,
        verifyEmailOTP,
        sendPhoneOTP,
        verifyPhoneOTP,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
