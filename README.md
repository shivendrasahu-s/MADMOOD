# MAD MOOD - Premium Men's Streetwear & Fashion Marketplace

MAD MOOD is an ultra-premium, luxury-grade men's fashion eCommerce marketplace inspired by international brands like Zara Men, U.S. Polo Assn., and Rare Rabbit. Featuring a dark, high-contrast gold-and-black cyber aesthetic, clean typography, responsive grids, a customizable landing page, and interactive elements.

## 🚀 Key Features

### 1. Unified Database Sync (Dual-Adapter)
- **Local Simulation Adapter**: Runs entirely out of the box using `localStorage` caching for user registry, wishlist, shopping cart items, promo codes, custom sliders, and order tracking.
- **Firebase live mode**: Automatically detects environment configurations (`VITE_FIREBASE_API_KEY`, etc.). Once present, it syncs authentication profiles, cart items, order dispatch logs, and storefront assets directly to Google Firebase and Cloud Firestore.

### 2. Premium Checkout & Payments
- **Razorpay Payments**: Integrated Razorpay SDK checkout flow supporting UPI, Cards, Netbanking, Wallets, and COD options.
- **Indian Taxation Breakout**: Automatically calculates and details 9.0% CGST and 9.0% SGST breakout lines under the standard 18% GST invoice system.
- **Signature Verification**: Validates payment responses securely.

### 3. Expanded Product Catalog
- **14 Collections**: Oversized T-Shirts, Polo T-Shirts, Premium Shirts, Hoodies, Sweatshirts, Cargo Pants, Jeans, Sneakers, Jackets, Co-ord Sets, Summer Wear, Formal Wear, Streetwear, Accessories.
- **28 Premium Products**: Predefined catalog of premium apparel complete with high-resolution imagery, zoom transitions, cross-fades, detailed description tags, colors, and sizes.

### 4. Admin Management Center (`/admin/dashboard`)
- Full control panel for managing products (Create, Read, Update, Delete).
- Banners slides configuration editor (live custom slider update triggers).
- Marketing popup text, image, and coupon manager.
- Real-time order fulfillment dispatcher (Fulfill/Cancel/Deliver simulated orders or real Firestore orders).

### 5. Luxury Micro-interactions
- **Custom Cursor Follower**: Ambient cursor follow dot and ring trail styling.
- **Ambient Audio Drone**: Web Audio API-synthesized low-frequency sci-fi synth drone that breathes with the page scroll (supports mute/unmute).
- **Zara Sharp-Edges styling**: `border-radius: 0px` buttons for a clean luxury feel.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS & Custom CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Slider Component**: Swiper.js
- **Database / Auth Services**: Firebase SDK v11 & Custom Local Adapter
- **Payment Processing**: Razorpay Checkout SDK

---

## ⚙️ Environment Configurations

Create a `.env` or `.env.local` file in the root directory to activate live services:

```env
# FIREBASE CREDENTIALS
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# RAZORPAY PAYMENT KEY
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

*Note: If these variables are omitted, the application will run in simulated demo mode with fully working transactions and credentials caching locally.*

---

## 🏃 Run the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Compile build bundles**:
   ```bash
   npm run build
   ```
   The static build bundles will output directly to the `/dist` directory.
