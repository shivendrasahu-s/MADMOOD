import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verify if environment config keys are active
export const isFirebaseEnabled = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== '' && 
  firebaseConfig.apiKey !== 'your_api_key_here';

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseEnabled) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ MAD MOOD: Connected to Live Firebase Database.');
  } catch (error) {
    console.error('❌ MAD MOOD: Firebase initialization error. Falling back to local adapter.', error);
  }
} else {
  console.log('⚡ MAD MOOD: Running in Simulated Local Storage Database.');
}

export { auth, db, storage };
export default app;
