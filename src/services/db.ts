import { isFirebaseEnabled, db } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number; // Actual selling price
  mrp: number; // Maximum Retail Price for strike-through
  description: string;
  category: 
    | 'Oversized T-Shirts'
    | 'Polo T-Shirts'
    | 'Premium Shirts'
    | 'Hoodies'
    | 'Sweatshirts'
    | 'Cargo Pants'
    | 'Jeans'
    | 'Sneakers'
    | 'Jackets'
    | 'Co-ord Sets'
    | 'Summer Wear'
    | 'Formal Wear'
    | 'Streetwear'
    | 'Accessories';
  sizes: string[];
  images: string[];
  reviews: Review[];
  stock: number;
  isBestSeller?: boolean;
  isNewRelease?: boolean;
  details: string[];
  colors?: string[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  label: string; // Home, Office, etc.
  streetAddress: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    product: Product;
    quantity: number;
    size: string;
    priceAtPurchase: number;
  }[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'COD' | 'UPI' | 'Card' | 'Netbanking' | 'Wallet' | 'Online';
  status: 'Pending' | 'Paid' | 'Failed' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

// Initial Premium Menswear Products (USPA & Zara Style)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ind-1',
    name: 'CLASSIC OFF-WHITE OVERSIZED TEE',
    price: 1199,
    mrp: 2399,
    description: 'Heavyweight drop shoulder tee in off-white. Spun out of 240 GSM organic terry cotton fabric, offering a structured boxy street fit.',
    category: 'Oversized T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-o1', userName: 'Yash Sharma', rating: 5, comment: 'Incredible thickness. Feels very premium, loose fit is spot-on.', date: '2026-05-21' }
    ],
    stock: 50,
    isBestSeller: true,
    isNewRelease: true,
    details: [
      '240 GSM Heavyweight Terry Cotton',
      'Relaxed boxy street fit',
      'Drop shoulder seams with reinforced ribbing'
    ],
    colors: ['Off-White', 'Classic Black']
  },
  {
    id: 'ind-2',
    name: 'URBAN CHARCOAL OVERSIZED TEE',
    price: 1299,
    mrp: 2599,
    description: 'Premium washed charcoal oversized tee with a minimalist brand graphic print at the back. Acid-washed for an authentic worn-in aesthetic.',
    category: 'Oversized T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 40,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% French Terry Cotton',
      'Acid washed vintage charcoal finish',
      'High-density rubber brand print at back'
    ],
    colors: ['Charcoal Gray', 'Acid Wash']
  },
  {
    id: 'ind-3',
    name: 'CLASSIC NAVY PIQUE POLO T-SHIRT',
    price: 1499,
    mrp: 2999,
    description: 'A timeless classic pique polo designed with a textured cotton weave, custom signature chest embroidery, and contrast tipping details. Perfect for an elevated casual look.',
    category: 'Polo T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m1', userName: 'Aman Singhania', rating: 5, comment: 'Exceptional fit and structure. Holds its shape well after washing.', date: '2026-05-20' },
      { id: 'rev-m2', userName: 'Vikram Malhotra', rating: 4, comment: 'Great quality cotton, feels premium like USPA. Sizing is true to fit.', date: '2026-05-22' }
    ],
    stock: 45,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '100% Premium Combed Pique Cotton',
      'Contrast ribbed polo collar and cuffs',
      'Two-button placket with authentic pearl buttons',
      'Regular fit, machine washable'
    ],
    colors: ['Navy Blue', 'White', 'Sandy Gold']
  },
  {
    id: 'ind-4',
    name: 'MODERN STRIPED COLLAR MOCK POLO',
    price: 1699,
    mrp: 3299,
    description: 'Contemporary mock polo featuring micro-stripe collar accents and a mercerized cotton finish. Blends Zara-style clean lines with classic sportswear details.',
    category: 'Polo T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m3', userName: 'Rohan Joshi', rating: 5, comment: 'Very soft finish. The stripe on the collar adds a classy touch.', date: '2026-05-18' }
    ],
    stock: 30,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% Mercerized Egyptian Cotton',
      'Super-soft silk-touch finish',
      'Sporty stripe detail on cuffs and collar',
      'Slim fit silhouette'
    ],
    colors: ['Teal Green', 'Jet Black']
  },
  {
    id: 'ind-5',
    name: 'PURE EGYPTIAN LINEN SLUB SHIRT',
    price: 2299,
    mrp: 4499,
    description: 'Premium casual shirt spun from breathable Egyptian linen yarn. Features a lightweight textured slub weave, relaxed collar, and curved hem.',
    category: 'Premium Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m4', userName: 'Kabir Oberoi', rating: 5, comment: 'Linen is so soft and lightweight. Perfect for warm days.', date: '2026-05-15' }
    ],
    stock: 25,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '100% Organic Egyptian Linen Slub',
      'Premium breathable open structure',
      'Curved tail hem with gusset reinforcement',
      'Adjustable button barrel cuffs'
    ],
    colors: ['Sandy Brown', 'Beige', 'White']
  },
  {
    id: 'ind-6',
    name: 'TAILORED CHAMBRAY CASUAL SHIRT',
    price: 1999,
    mrp: 3999,
    description: 'Rugged yet refined casual chambray shirt. Woven from durable combed cotton yarns with double chest utility compartments and pearlised closures.',
    category: 'Premium Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620012253295-c05cb127c213?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 35,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% Combed Chambray Cotton',
      'Double needle structural stitching',
      'Curved hemline, regular fit'
    ],
    colors: ['Indigo Blue', 'Light Blue']
  },
  {
    id: 'ind-7',
    name: 'PREMIUM FRENCH TERRY PULLOVER HOODIE',
    price: 2999,
    mrp: 5999,
    description: 'Luxurious brushed loopback cotton hoodie designed with a double-layered crossover hood, ribbed side panels, and matte steel drawstring aglets.',
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m6', userName: 'Rithvik S.', rating: 4, comment: 'Extremely cozy and thick. Feels like a high-end streetwear label.', date: '2026-05-24' }
    ],
    stock: 18,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '100% Organic Cotton French Terry (380 GSM)',
      'Double-lined hood with cross collar base',
      'Kangaroo hand pockets',
      'Comfort ribbed cuffs and hemline'
    ],
    colors: ['Olive Green', 'Deep Black']
  },
  {
    id: 'ind-8',
    name: 'URBAN STREETWEAR ZIP-UP HOODIE',
    price: 3299,
    mrp: 6499,
    description: 'Heavyweight cotton-blend fleece full-zip hoodie featuring front zip compartments, raw utility seams, and loose drop shoulder street drape.',
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 20,
    isBestSeller: false,
    isNewRelease: false,
    details: [
      'Heavy fleece fabric (400 GSM)',
      'Two-way heavy duty YKK zipper',
      'Adjustable hood drawstrings with custom brass toggle'
    ],
    colors: ['Heather Gray', 'Charcoal Black']
  },
  {
    id: 'ind-9',
    name: 'CORE CREWNECK FLEECE SWEATSHIRT',
    price: 1899,
    mrp: 3799,
    description: 'Classic crewneck sweatshirt spun out of organic combed cotton loopback fleece. Cut to an athletic tailored profile, perfect for smart layering.',
    category: 'Sweatshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 30,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% Organic Combed Cotton fleece',
      'Ribbed knit neck, waist hem and cuffs',
      'Flatlock stitched seam construction'
    ],
    colors: ['Sand Beige', 'Navy Blue']
  },
  {
    id: 'ind-10',
    name: 'SIGNATURE COTTON KNIT MOCK SWEATSHIRT',
    price: 2199,
    mrp: 4299,
    description: 'Elevated mock-neck sweatshirt knitted out of fine, lightweight cotton yarns. Built with a brushed interior layer and a secure half-zip metal brass slider.',
    category: 'Sweatshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 22,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      'Premium long-staple cotton knit',
      'Brushed thermal-retaining interior finish',
      'High-profile mock zipper closure'
    ],
    colors: ['Charcoal Gray', 'Stealth Black']
  },
  {
    id: 'ind-11',
    name: 'TAILORED UTILITY D-RING CARGO PANTS',
    price: 2499,
    mrp: 4999,
    description: 'Constructed from lightweight stretch-cotton ripstop fabrics. Configured with low-profile cargo pocket flaps, drawstring hems, and a D-ring waist anchor.',
    category: 'Cargo Pants',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 25,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '97% Cotton Ripstop weave, 3% Elastane stretch',
      'Dual utility flat pocket compartments',
      'Ankle adjustable drawstring toggles',
      'Front waist gunmetal D-ring anchor'
    ],
    colors: ['Military Green', 'Midnight Black']
  },
  {
    id: 'ind-12',
    name: 'TACTICAL MULTI-POCKET CARGO JOGGERS',
    price: 2699,
    mrp: 5299,
    description: 'Streetwear tapered cargo joggers woven out of premium cotton gabardine twill. Engineered with zipper expandable tactical pockets and cuffed elastic closures.',
    category: 'Cargo Pants',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 28,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      'Heavy-duty cotton twill weave',
      '6 utility tactical pocket configurations',
      'Ankle elastic cuffed ribbing'
    ],
    colors: ['Stealth Black', 'Khaki Sand']
  },
  {
    id: 'ind-13',
    name: 'EXECUTIVE SLIM STRETCH DENIM JEANS',
    price: 2799,
    mrp: 5599,
    description: 'Clean-wash dark indigo denim jeans tailored to a sharp slim fit with moderate stretch elasticity. Complete with custom rivets and leather label branding.',
    category: 'Jeans',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m7', userName: 'Kartik A.', rating: 5, comment: 'Best fitting jeans. Stretch is perfect, not too loose. Color is rich deep blue.', date: '2026-05-23' }
    ],
    stock: 22,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '98% Denim Cotton, 2% Elastane stretch',
      'Sanforized indigo dyed finish',
      'Classic 5-pocket layout',
      'Full grain leather waist patch logo'
    ],
    colors: ['Indigo Blue', 'Jet Black']
  },
  {
    id: 'ind-14',
    name: 'VINTAGE WASH TAPERED COMFORT JEANS',
    price: 2999,
    mrp: 5999,
    description: 'Relaxed fit jeans featuring tapered ankle lines. Stonewashed and scraped by hand to present authentic vintage high-and-low denim indigo textures.',
    category: 'Jeans',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 15,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% Rigid Combed Denim weave',
      'Artisanal hand-scraping whiskers',
      'Signature heavy-duty zinc alloy shank button'
    ],
    colors: ['Stonewash Indigo', 'Light Blue']
  },
  {
    id: 'ind-15',
    name: 'PREMIUM CALFSKIN LEATHER WHITE SNEAKERS',
    price: 3999,
    mrp: 7999,
    description: 'Minimalist low-top sneakers handcrafted from fine Italian calfskin leather. Built with an anti-skid rubber cupsole and cushion footbeds for all-day comfort.',
    category: 'Sneakers',
    sizes: ['7', '8', '9', '10'],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m8', userName: 'Yash Vardhan', rating: 5, comment: 'Insanely premium leather. Competes directly with Zara / Premium imports.', date: '2026-05-21' }
    ],
    stock: 15,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '100% Genuine Full-grain Calfskin leather upper',
      'Ultra-soft calfskin lining inside',
      'Stitched anti-skid cup rubber outsole',
      'Memory foam footbed insert lining'
    ],
    colors: ['Cloud White', 'Nude Leather']
  },
  {
    id: 'ind-16',
    name: 'VINTAGE SUEDE RETRO SPORT RUNNERS',
    price: 3799,
    mrp: 7499,
    description: 'Panelled retro runner sneakers combining premium Italian cow split suede with breathable nylon mesh. Features dual-density EVA midsoles for structured cushioning.',
    category: 'Sneakers',
    sizes: ['7', '8', '9', '10'],
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 18,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      'Genuine Italian cow split suede upper',
      'Removable Ortholite foam cushioning',
      'Tread-patterned anti-slip rubber outsoles'
    ],
    colors: ['Olive/Sand', 'Grey/Navy']
  },
  {
    id: 'ind-17',
    name: 'VINTAGE SHEEPSKIN CAFE RACER JACKET',
    price: 5999,
    mrp: 11999,
    description: 'Handcrafted leather cafe racer jacket cut from thick, premium sheepskin hides. Styled with an ergonomic band collar, snap closures, and heavy gunmetal YKK hardware.',
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 10,
    isBestSeller: true,
    isNewRelease: true,
    details: [
      '100% Genuine Selected Sheepskin leather',
      'Silky smooth interior lining panels',
      'Secure zip sleeve cuffs and chest pockets'
    ],
    colors: ['Vintage Black', 'Mahogany Brown']
  },
  {
    id: 'ind-18',
    name: 'CLASSIC DESTRUCTED DENIM TRUCKER JACKET',
    price: 3499,
    mrp: 6999,
    description: 'Heavyweight organic cotton denim trucker jacket built with contrast orange stitching, structured flat chest pockets, and custom adjustable button tabs at the waist.',
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 15,
    isBestSeller: false,
    isNewRelease: false,
    details: [
      '14 oz Heavyweight Rigid Cotton Denim',
      'Embossed brass button closure panels',
      'Adjustable side waist tabs'
    ],
    colors: ['Stonewash Blue', 'Black Denim']
  },
  {
    id: 'ind-19',
    name: 'BELGIAN LINEN RESORT CO-ORD SET',
    price: 3299,
    mrp: 6499,
    description: 'Sophisticated resort set featuring a short-sleeve camp collar shirt and matching drawcord shorts, woven from premium Belgian flax linen.',
    category: 'Co-ord Sets',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 12,
    isBestSeller: true,
    isNewRelease: true,
    details: [
      '100% Premium Belgian Flax Linen',
      'Shirt: Cuban camp collar, flat hem',
      'Shorts: Elastic drawcord waist, mesh-lined side pockets'
    ],
    colors: ['Sage Green', 'Oatmeal Beige']
  },
  {
    id: 'ind-20',
    name: 'URBAN TERRY SWEAT CO-ORD SET',
    price: 3499,
    mrp: 6999,
    description: 'Casual luxury co-ord set featuring a relaxed drop-shoulder crewneck sweatshirt and matching cargo-style cuffed joggers in heavy French Terry.',
    category: 'Co-ord Sets',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 15,
    isBestSeller: false,
    isNewRelease: false,
    details: [
      '100% French Terry Cotton (340 GSM)',
      'Tonal brand emblem embroidery',
      'Elastic waist jogger with cuffed bottoms'
    ],
    colors: ['Stealth Charcoal', 'Slate Blue']
  },
  {
    id: 'ind-21',
    name: 'BOTANICAL CUBAN RESORT SHIRT',
    price: 1599,
    mrp: 3199,
    description: 'Ultra-lightweight vacation shirt featuring custom botanical screen prints, a relaxed Cuban collar, and a straight cut. Spun from premium fluid viscose.',
    category: 'Summer Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 20,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% Breathable Rayon Viscose',
      'Fluid relaxed camp collar profile',
      'Breathable loose summer structure'
    ],
    colors: ['Palm Green', 'Nautical Blue']
  },
  {
    id: 'ind-22',
    name: 'ORGANIC COTTON TWILL CARGO SHORTS',
    price: 1799,
    mrp: 3499,
    description: 'Mid-length casual shorts woven out of organic cotton twill yarn. Styled with two low-profile side flat cargo compartments.',
    category: 'Summer Wear',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 25,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '100% Organic Combed Twill Cotton',
      'Rear and side utility pockets',
      'Double stitched seams for extreme durability'
    ],
    colors: ['Khaki Tan', 'Military Olive']
  },
  {
    id: 'ind-23',
    name: 'SIGNATURE SLIM FIT OXFORD SHIRT',
    price: 2499,
    mrp: 4999,
    description: 'A sharp, slim-fit dress shirt crafted from heavy basket-weave Oxford cotton. Features button-down collars and a neat embroidered logo.',
    category: 'Formal Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1620012253295-c05cb127c213?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      { id: 'rev-m5', userName: 'Devansh Verma', rating: 5, comment: 'Fit is excellent. Classic button-down style, perfect for corporate and smart casuals.', date: '2026-05-19' }
    ],
    stock: 20,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '100% Premium Oxford Weave Cotton',
      'Traditional button-down collar',
      'Tailored curved formal bottom hem'
    ],
    colors: ['Sky Blue', 'Pure White']
  },
  {
    id: 'ind-24',
    name: 'EXECUTIVE TWILL DOUBLE PLY SHIRT',
    price: 2699,
    mrp: 5299,
    description: 'Super-fine Giza double ply cotton twill formal shirt. Styled with a sharp structured cutaway collar and double button cuffs.',
    category: 'Formal Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620012253295-c05cb127c213?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 22,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      '100% Giza Cotton twill fabric',
      'Elegant cutaway collar stays',
      'Premium tailored executive profile'
    ],
    colors: ['French Lavender', 'Ice White']
  },
  {
    id: 'ind-25',
    name: 'COLORBLOCK RIPSTOP WINDBREAKER',
    price: 2999,
    mrp: 5999,
    description: 'Bold colorblocked windbreaker designed for streetwear enthusiasts. Structured out of water-resistant ripstop nylon shell with interior mesh lining.',
    category: 'Streetwear',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 18,
    isBestSeller: false,
    isNewRelease: true,
    details: [
      'Water-repellent durable ripstop nylon shell',
      'Reflective logo details, hood toggles',
      'Utility kangaroo zip pocket'
    ],
    colors: ['Navy/Black/White', 'Volt Yellow/Black']
  },
  {
    id: 'ind-26',
    name: 'HEAVY ORANGE-STITCH DENIM JACKET',
    price: 3799,
    mrp: 7499,
    description: 'Heavyweight loose fit denim jacket accented with contrast orange stitching, structured flat button pockets, and deep hand compartments.',
    category: 'Streetwear',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 12,
    isBestSeller: true,
    isNewRelease: false,
    details: [
      '14 oz Rigid Ring-spun Combed Denim',
      'Sturdy branded copper button fasteners',
      'Relaxed oversized streetwear cut'
    ],
    colors: ['Acid Wash Black', 'Indigo Stonewash']
  },
  {
    id: 'ind-27',
    name: 'HANDCRAFTED VEG-TANNED HARNESS BELT',
    price: 1299,
    mrp: 2599,
    description: 'Sleek, handcrafted dress belt cut from vegetable-tanned full grain harness leather. Styled with a solid brushed silver brass buckle.',
    category: 'Accessories',
    sizes: ['32', '34', '36', '38'],
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb8ec8bd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 30,
    isBestSeller: false,
    isNewRelease: false,
    details: [
      '100% Veg-Tanned Full Grain Harness Leather',
      'Brushed silver finish brass buckle',
      'Width: 1.25 inches (Standard loops)',
      'Hand-burnished wax-sealed edges'
    ],
    colors: ['Dark Cognac', 'Classic Black']
  },
  {
    id: 'ind-28',
    name: 'HEAVY CANVAS WEEKENDER DUFFEL BAG',
    price: 3299,
    mrp: 6499,
    description: 'Heavyweight cotton canvas duffel bag configured with full-grain leather handle trims, brass buckle locks, and detachable shoulder webbing strap.',
    category: 'Accessories',
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1624222247344-550fb8ec8bd3?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [],
    stock: 15,
    isBestSeller: true,
    isNewRelease: true,
    details: [
      '24 oz Combed Cotton Canvas weave',
      'Double-sided genuine leather edge reinforcing panels',
      'Detachable padded canvas shoulder strap'
    ],
    colors: ['Forest Olive', 'Stealth Charcoal']
  }
];

// LocalStorage Helper Scripts
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage', e);
  }
};

// Database Initialization
export const initDB = () => {
  if (!localStorage.getItem('mmi_products')) {
    setStoredData('mmi_products', INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem('mmi_users')) {
    setStoredData('mmi_users', {});
  }
  if (!localStorage.getItem('mmi_orders')) {
    setStoredData('mmi_orders', []);
  }
};

// Products API mockups
export const getProducts = (): Product[] => {
  initDB();
  return getStoredData<Product[]>('mmi_products', INITIAL_PRODUCTS);
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find(p => p.id === id);
};

export const addProductReview = (productId: string, rating: number, comment: string, userName: string): Product | undefined => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    const newReview: Review = {
      id: 'rev_' + Math.random().toString(36).substring(2, 9),
      userName: userName || 'Anonymous User',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    products[index].reviews = [newReview, ...products[index].reviews];
    setStoredData('mmi_products', products);
    return products[index];
  }
  return undefined;
};

// User Profile & Authentication flows Mockups
export const getCurrentSessionUser = (): User | null => {
  const userEmail = localStorage.getItem('mmi_session_user');
  if (!userEmail) return null;
  const users = getStoredData<Record<string, User>>('mmi_users', {});
  return users[userEmail] || null;
};

export const registerUser = (email: string, firstName: string, lastName: string): { success: boolean; message: string } => {
  const users = getStoredData<Record<string, User>>('mmi_users', {});
  const cleanEmail = email.toLowerCase().trim();
  if (users[cleanEmail]) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const isAdmin = cleanEmail === 'shivendrasahu002@gmail.com' || cleanEmail === 'admin@madmood.in';
  const newUser: User = {
    email: cleanEmail,
    firstName,
    lastName,
    isEmailVerified: false,
    isPhoneVerified: false,
    addresses: [],
    wishlist: [],
    isAdmin
  };
  users[cleanEmail] = newUser;
  setStoredData('mmi_users', users);
  localStorage.setItem('mmi_session_user', cleanEmail);
  return { success: true, message: 'Registration successful.' };
};

export const loginUser = (email: string): { success: boolean; message: string } => {
  const users = getStoredData<Record<string, User>>('mmi_users', {});
  const cleanEmail = email.toLowerCase().trim();
  if (!users[cleanEmail]) {
    return { success: false, message: 'Email address not found. Please sign up.' };
  }
  localStorage.setItem('mmi_session_user', cleanEmail);
  return { success: true, message: 'Login successful.' };
};

export const logoutUser = (): void => {
  localStorage.removeItem('mmi_session_user');
};

export const updateUserProfileFields = async (email: string, fields: Partial<User>): Promise<User> => {
  const users = getStoredData<Record<string, User>>('mmi_users', {});
  const cleanEmail = email.toLowerCase().trim();
  if (users[cleanEmail]) {
    users[cleanEmail] = {
      ...users[cleanEmail],
      ...fields
    };
    setStoredData('mmi_users', users);
    
    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, 'users', cleanEmail), users[cleanEmail]);
      } catch (e) {
        console.error('Error syncing user profile edit to Firestore:', e);
      }
    }
    return users[cleanEmail];
  }
  throw new Error('User profile not found.');
};

export const saveOTP = async (target: string, code: string): Promise<void> => {
  const expiry = Date.now() + 5 * 60 * 1000; // 5 mins
  if (isFirebaseEnabled && db) {
    try {
      await setDoc(doc(db, 'otps', target), { code, expiresAt: expiry });
    } catch (e) {
      console.error('Error saving OTP to Firestore:', e);
    }
  }
  // Store locally for simulation/fallback
  const otps = getStoredData<Record<string, { code: string; expiresAt: number }>>('mmi_otps', {});
  otps[target] = { code, expiresAt: expiry };
  setStoredData('mmi_otps', otps);
};

export const verifyOTP = async (target: string, code: string): Promise<boolean> => {
  let matchedCode = '';
  let expiresAt = 0;
  
  if (isFirebaseEnabled && db) {
    try {
      const snap = await getDoc(doc(db, 'otps', target));
      if (snap.exists()) {
        const data = snap.data();
        matchedCode = data.code;
        expiresAt = data.expiresAt;
      }
    } catch (e) {
      console.error('Error reading OTP from Firestore:', e);
    }
  }
  
  if (!matchedCode) {
    const otps = getStoredData<Record<string, { code: string; expiresAt: number }>>('mmi_otps', {});
    const entry = otps[target];
    if (entry) {
      matchedCode = entry.code;
      expiresAt = entry.expiresAt;
    }
  }
  
  if (matchedCode === code && Date.now() < expiresAt) {
    // Delete OTP after successful verification
    const otps = getStoredData<Record<string, any>>('mmi_otps', {});
    delete otps[target];
    setStoredData('mmi_otps', otps);
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, 'otps', target));
      } catch (e) {
        console.error('Error deleting OTP from Firestore:', e);
      }
    }
    return true;
  }
  return false;
};

export interface SentEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  timestamp: string;
}

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  if (isFirebaseEnabled && db) {
    try {
      const emailId = 'email_' + Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'emails', emailId), {
        to: [to],
        message: {
          subject,
          html,
        },
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error logging email trigger to Firestore:', e);
    }
  }
  
  const sentEmails = getStoredData<SentEmail[]>('mmi_sent_emails', []);
  const newEmail: SentEmail = {
    id: 'eml_' + Math.random().toString(36).substring(2, 9),
    to,
    subject,
    html,
    timestamp: new Date().toISOString()
  };
  sentEmails.unshift(newEmail);
  setStoredData('mmi_sent_emails', sentEmails.slice(0, 50));
  
  console.log(`📧 [MAD MOOD EMAIL SYSTEM] SENT TO: ${to}\nSUBJECT: ${subject}\nHTML: RENDERED IN VISUAL SIMULATOR DRAWER.`);
  window.dispatchEvent(new Event('mmi_email_dispatched'));
};

export const sendSMS = (phone: string, message: string): void => {
  console.log(`📱 [MAD MOOD SMS SYSTEM] TO: ${phone}\nMESSAGE: ${message}`);
  
  const sentSms = getStoredData<{ phone: string; message: string; timestamp: string }[]>('mmi_sent_sms', []);
  sentSms.unshift({ phone, message, timestamp: new Date().toISOString() });
  setStoredData('mmi_sent_sms', sentSms.slice(0, 50));
  
  window.dispatchEvent(new Event('mmi_sms_dispatched'));
};

export const updateUserWishlist = (productId: string): { active: boolean } => {
  const user = getCurrentSessionUser();
  if (!user) return { active: false };

  const users = getStoredData<Record<string, User>>('mmi_users', {});
  const userEmail = user.email;
  const wishlist = users[userEmail].wishlist || [];
  const idx = wishlist.indexOf(productId);
  let active = false;

  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(productId);
    active = true;
  }

  users[userEmail].wishlist = wishlist;
  setStoredData('mmi_users', users);
  
  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'users', userEmail), users[userEmail]).catch(err => console.error('Firestore user wishlist sync error:', err));
  }
  return { active };
};

export const updateUserAddress = (address: Omit<Address, 'id'>, id?: string): Address[] => {
  const user = getCurrentSessionUser();
  if (!user) return [];

  const users = getStoredData<Record<string, User>>('mmi_users', {});
  const userEmail = user.email;
  const addresses = users[userEmail].addresses || [];

  if (id) {
    const idx = addresses.findIndex(a => a.id === id);
    if (idx !== -1) {
      addresses[idx] = { ...address, id };
    }
  } else {
    const newAddress: Address = {
      ...address,
      id: 'addr_' + Math.random().toString(36).substring(2, 9)
    };
    addresses.push(newAddress);
  }

  users[userEmail].addresses = addresses;
  setStoredData('mmi_users', users);

  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'users', userEmail), users[userEmail]).catch(err => console.error('Firestore user address sync error:', err));
  }
  return addresses;
};

export const deleteUserAddress = (id: string): Address[] => {
  const user = getCurrentSessionUser();
  if (!user) return [];

  const users = getStoredData<Record<string, User>>('mmi_users', {});
  const userEmail = user.email;
  const addresses = users[userEmail].addresses || [];
  const filtered = addresses.filter(a => a.id !== id);

  users[userEmail].addresses = filtered;
  setStoredData('mmi_users', users);

  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'users', userEmail), users[userEmail]).catch(err => console.error('Firestore user address deletion sync error:', err));
  }
  return filtered;
};

// Cart Engine state mocks
export const getCart = (): CartItem[] => {
  return getStoredData<CartItem[]>('mmi_cart', []);
};

export const addToCart = (productId: string, quantity: number, size: string): CartItem[] => {
  const cart = getCart();
  const idx = cart.findIndex(item => item.productId === productId && item.selectedSize === size);
  if (idx !== -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({ productId, quantity, selectedSize: size });
  }
  setStoredData('mmi_cart', cart);
  return cart;
};

export const updateCartItemQuantity = (productId: string, size: string, quantity: number): CartItem[] => {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(item => !(item.productId === productId && item.selectedSize === size));
  } else {
    const idx = cart.findIndex(item => item.productId === productId && item.selectedSize === size);
    if (idx !== -1) {
      cart[idx].quantity = quantity;
    }
  }
  setStoredData('mmi_cart', cart);
  return cart;
};

export const clearCart = (): void => {
  localStorage.removeItem('mmi_cart');
};

// Indian Order Placements & GST Billing APIs
export const getOrders = (): Order[] => {
  const user = getCurrentSessionUser();
  const orders = getStoredData<Order[]>('mmi_orders', []);
  if (!user) return [];
  return orders.filter(o => o.shippingAddress.phone.includes(user.email) || o.id.startsWith('MM-'));
};

export const getOrderById = (id: string): Order | undefined => {
  const orders = getStoredData<Order[]>('mmi_orders', []);
  return orders.find(o => o.id === id || o.trackingNumber === id);
};

// --- PREMIUM EMAIL TEMPLATE COMPILERS ---

const getCustomerOrderEmailHtml = (order: Order, customerName: string): string => {
  const itemsRows = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-weight: 600; color: #ffffff; font-size: 13px;">
        ${item.product.name} (Size: ${item.size})
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; text-align: center; color: #a3a3a3; font-size: 13px;">
        x${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; text-align: right; font-weight: 700; color: #ffffff; font-size: 13px;">
        ₹${(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `
    <div style="background-color: #000000; color: #ffffff; font-family: 'Outfit', Arial, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #111;">
      <div style="text-align: center; border-bottom: 1px solid #111; padding-bottom: 25px; margin-bottom: 30px;">
        <h1 style="letter-spacing: 0.3em; font-weight: 900; margin: 0; color: #ffffff; font-size: 24px;">MAD <span style="color: #ff0d2b;">MOOD</span></h1>
        <p style="font-size: 8px; color: #a3a3a3; letter-spacing: 0.2em; margin: 5px 0 0 0; text-transform: uppercase;">Official Confirmation invoice</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 12px; text-transform: uppercase;">Order Confirmed</h2>
        <p style="color: #a3a3a3; font-size: 13px; line-height: 1.6; margin: 0;">Dear ${customerName},</p>
        <p style="color: #a3a3a3; font-size: 13px; line-height: 1.6; margin: 8px 0 0 0;">Your purchase request has been verified. We are packaging your configurations for dispatch. Below is your commercial invoice summary.</p>
      </div>

      <div style="background-color: #050505; border: 1px solid #111; padding: 20px; margin-bottom: 30px;">
        <h3 style="font-size: 11px; color: #ff0d2b; letter-spacing: 0.1em; margin: 0 0 12px 0; border-bottom: 1px solid #111; padding-bottom: 8px; text-transform: uppercase; font-family: 'Orbitron', sans-serif;">TELEMETRY METADATA</h3>
        <table style="width: 100%; font-size: 12px; color: #a3a3a3; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0;"><strong>Order Reference:</strong></td>
            <td style="padding: 4px 0; text-align: right; color: #ffffff; font-weight: bold;">${order.id}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Tracking Transit ID:</strong></td>
            <td style="padding: 4px 0; text-align: right; color: #ffffff;">${order.trackingNumber}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Settlement Channel:</strong></td>
            <td style="padding: 4px 0; text-align: right; color: #ffffff; text-transform: uppercase;">${order.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Fulfillment ETA:</strong></td>
            <td style="padding: 4px 0; text-align: right; color: #ffffff;">3-5 Business Days</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 11px; color: #ff0d2b; letter-spacing: 0.1em; margin: 0 0 12px 0; border-bottom: 1px solid #111; padding-bottom: 8px; text-transform: uppercase; font-family: 'Orbitron', sans-serif;">LINE ACQUISITIONS</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid #111; text-align: left; color: #a3a3a3;">
              <th style="padding-bottom: 8px; font-weight: 500;">SPECIFICATION</th>
              <th style="padding-bottom: 8px; text-align: center; font-weight: 500;">QTY</th>
              <th style="padding-bottom: 8px; text-align: right; font-weight: 500;">RATE</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <div style="width: 220px; margin-left: auto; margin-bottom: 30px; font-size: 12px; color: #a3a3a3;">
        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
          <span>Bag Subtotal:</span>
          <span style="color: #ffffff;">₹${order.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${order.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #03a685; font-weight: 600;">
          <span>Promo Code:</span>
          <span>-₹${order.discount.toLocaleString('en-IN')}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
          <span>CGST (9.0%):</span>
          <span style="color: #ffffff;">₹${Math.round(order.gstAmount / 2).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
          <span>SGST (9.0%):</span>
          <span style="color: #ffffff;">₹${Math.round(order.gstAmount / 2).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
          <span>Shipping:</span>
          <span style="color: #ffffff;">${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #ff0d2b; padding-top: 8px; margin-top: 8px; font-size: 14px; font-weight: 900; color: #ffffff;">
          <span>Grand Total:</span>
          <span style="color: #ff0d2b;">₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="border-top: 1px solid #111; padding-top: 20px; font-size: 12px; color: #a3a3a3; margin-bottom: 25px;">
        <h4 style="margin: 0 0 6px 0; color: #ffffff; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; font-family: 'Orbitron', sans-serif;">SHIPPING DESTINATION</h4>
        <p style="margin: 0; line-height: 1.6; color: #ffffff;">
          ${order.shippingAddress.streetAddress}, ${order.shippingAddress.locality}<br />
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br />
          <span style="color: #a3a3a3;">Contact Phone:</span> ${order.shippingAddress.phone}
        </p>
      </div>

      <div style="border-top: 1px solid #111; padding-top: 20px; text-align: center; font-size: 10px; color: #555555; line-height: 1.6; font-family: 'Orbitron', sans-serif;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #a3a3a3; letter-spacing: 0.1em;">MAD MOOD CO.</p>
        <p style="margin: 0 0 4px 0;">Unnao, Uttar Pradesh, India - 209801 | +91 6386376901</p>
        <p style="margin: 0;">Powered by: Mr. Pushpendra Sahu, Mr. Shivendra Sahu & Mr. Dipendra Sahu</p>
      </div>
    </div>
  `;
};

const getAdminOrderEmailHtml = (order: Order, customerName: string, customerEmail: string): string => {
  const itemsRows = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; font-size: 13px;">${item.product.name} (ID: ${item.product.id})</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-size: 13px;">${item.size}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-size: 13px;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 13px;">₹${item.priceAtPurchase.toLocaleString('en-IN')}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 13px; font-weight: 700;">₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #ccc; color: #333; max-width: 650px; margin: 0 auto; background-color: #ffffff;">
      <h2 style="color: #000; border-bottom: 2px solid #ff0d2b; padding-bottom: 10px; margin-top: 0; font-size: 18px; letter-spacing: 0.02em;">⚠️ NEW ECOMMERCE ORDER RECEIVED</h2>
      <p style="font-size: 13px; color: #666;">A new purchase transaction was successfully completed on the storefront backend.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #eee;">
        <tr style="background: #f5f5f5;"><td colspan="2" style="padding: 8px; font-weight: 700; border: 1px solid #eee;">CUSTOMER PROFILE</td></tr>
        <tr><td style="padding: 8px; width: 150px; font-weight: 700; border: 1px solid #eee;">Name:</td><td style="padding: 8px; border: 1px solid #eee;">${customerName}</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Email:</td><td style="padding: 8px; border: 1px solid #eee;">${customerEmail}</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Verified Phone:</td><td style="padding: 8px; border: 1px solid #eee;">${order.shippingAddress.phone}</td></tr>
        
        <tr style="background: #f5f5f5;"><td colspan="2" style="padding: 8px; font-weight: 700; border: 1px solid #eee;">TRANSACTION RECORD</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Order ID:</td><td style="padding: 8px; font-weight: bold; color: #ff0d2b; border: 1px solid #eee;">${order.id}</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Timestamp:</td><td style="padding: 8px; border: 1px solid #eee;">${new Date(order.date).toLocaleString('en-IN')}</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Payment Method:</td><td style="padding: 8px; text-transform: uppercase; border: 1px solid #eee;">${order.paymentMethod}</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Settlement Status:</td><td style="padding: 8px; font-weight: bold; color: #03a685; border: 1px solid #eee;">${order.status}</td></tr>
        <tr><td style="padding: 8px; font-weight: 700; border: 1px solid #eee;">Grand Total:</td><td style="padding: 8px; font-weight: bold; font-size: 14px; border: 1px solid #eee;">₹${order.total.toLocaleString('en-IN')}</td></tr>
      </table>

      <h3 style="font-size: 13px; margin-bottom: 8px; font-weight: 700;">ACQUISITION DETAILS:</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #000; color: #fff; text-align: left;">
            <th style="padding: 8px; border: 1px solid #000;">ITEM DESCRIPTION</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center;">SIZE</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center;">QTY</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: right;">RATE</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: right;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <h3 style="font-size: 13px; margin-bottom: 8px; font-weight: 700;">SHIPPING ADDRESS DETAILS:</h3>
      <div style="background-color: #fafafa; padding: 12px; border: 1px solid #eee; font-size: 12px;">
        <p style="margin: 0; line-height: 1.5;">
          ${order.shippingAddress.streetAddress}, ${order.shippingAddress.locality}<br />
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
        </p>
      </div>
      
      <p style="font-size: 10px; color: #999; text-align: center; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px;">
        MAD MOOD AUTOMATED ADMIN TERMINAL // UNNAO CAMPUS
      </p>
    </div>
  `;
};

const getOrderStatusEmailHtml = (order: Order, customerName: string): string => {
  return `
    <div style="background-color: #000000; color: #ffffff; font-family: 'Outfit', Arial, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #111;">
      <div style="text-align: center; border-bottom: 1px solid #111; padding-bottom: 25px; margin-bottom: 30px;">
        <h1 style="letter-spacing: 0.3em; font-weight: 900; margin: 0; color: #ffffff; font-size: 24px;">MAD <span style="color: #ff0d2b;">MOOD</span></h1>
        <p style="font-size: 8px; color: #a3a3a3; letter-spacing: 0.2em; margin: 5px 0 0 0; text-transform: uppercase;">Order Transit telemetries</p>
      </div>

      <div style="margin-bottom: 30px; text-align: center;">
        <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 10px; text-transform: uppercase;">Transit Status Update</h2>
        <p style="color: #a3a3a3; font-size: 13px;">Dear ${customerName},</p>
        <p style="color: #a3a3a3; font-size: 13px; line-height: 1.5; margin: 10px 0;">
          Your order <strong>${order.id}</strong> status has been successfully updated:
        </p>
        <div style="display: inline-block; background-color: #ff0d2b; color: #ffffff; font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 900; padding: 8px 24px; margin: 15px 0; letter-spacing: 0.1em;">
          ${order.status.toUpperCase()}
        </div>
      </div>

      <div style="background-color: #050505; border: 1px solid #111; padding: 15px; margin-bottom: 30px; font-size: 12px; color: #a3a3a3; line-height: 1.6;">
        <p style="margin: 0 0 4px 0;"><strong>Tracking Transit ID:</strong> ${order.trackingNumber}</p>
        <p style="margin: 0 0 4px 0;"><strong>Settlement:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p style="margin: 0;"><strong>Fulfillment Partner:</strong> MAD EXPRESS COURIER</p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="http://localhost:5173/order-tracking/${order.id}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 10px 24px; text-decoration: none; font-weight: 700; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">
          Track Live Dispatch
        </a>
      </div>

      <div style="border-top: 1px solid #111; padding-top: 20px; text-align: center; font-size: 10px; color: #555555; line-height: 1.6; font-family: 'Orbitron', sans-serif;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #a3a3a3; letter-spacing: 0.1em;">MAD MOOD CO.</p>
        <p style="margin: 0;">Unnao, Uttar Pradesh, India - 209801 | +91 6386376901</p>
      </div>
    </div>
  `;
};

export const createOrder = (
  cartItems: { product: Product; quantity: number; size: string }[],
  subtotal: number,
  discount: number,
  gstAmount: number,
  shipping: number,
  total: number,
  shippingAddress: Address,
  paymentMethod: Order['paymentMethod'],
  status: Order['status'] = 'Pending',
  razorpayOrderId?: string,
  razorpayPaymentId?: string,
  razorpaySignature?: string
): Order => {
  const orders = getStoredData<Order[]>('mmi_orders', []);
  const randomId = 'MM-IND-' + Math.floor(100000 + Math.random() * 900000);
  const randomTracking = 'MMTRKIND' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const newOrder: Order = {
    id: randomId,
    date: new Date().toISOString(),
    items: cartItems.map(i => ({
      product: i.product,
      quantity: i.quantity,
      size: i.size,
      priceAtPurchase: i.product.price
    })),
    subtotal,
    discount,
    gstAmount,
    shipping,
    total,
    shippingAddress,
    paymentMethod,
    status,
    trackingNumber: randomTracking,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  };

  orders.push(newOrder);
  setStoredData('mmi_orders', orders);
  clearCart();

  // Stock updates
  const products = getProducts();
  cartItems.forEach(item => {
    const pIdx = products.findIndex(p => p.id === item.product.id);
    if (pIdx !== -1) {
      products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
      // Sync stock update to Firestore
      if (isFirebaseEnabled && db) {
        setDoc(doc(db, 'products', products[pIdx].id), products[pIdx]).catch(err => console.error('Firestore stock sync error:', err));
      }
    }
  });
  setStoredData('mmi_products', products);

  // Sync order placement to Firestore
  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err: any) => console.error('Firestore order sync error:', err));
  }

  // Trigger Confirmation Notifications
  const user = getCurrentSessionUser();
  const customerEmail = user?.email || 'customer@madmood.in';
  const customerName = user ? `${user.firstName} ${user.lastName}` : shippingAddress.label;
  
  // Customer Email invoice
  const customerHtml = getCustomerOrderEmailHtml(newOrder, customerName);
  sendEmail(customerEmail, `MAD MOOD: ORDER CONFIRMED - ${newOrder.id}`, customerHtml);

  // Admin Notification Email
  const adminHtml = getAdminOrderEmailHtml(newOrder, customerName, customerEmail);
  sendEmail('shivendrasahu002@gmail.com', `MAD MOOD ADMIN: NEW ORDER - ${newOrder.id}`, adminHtml);

  // SMS dispatch to customer
  sendSMS(shippingAddress.phone, `MAD MOOD: Your order ${newOrder.id} of INR ${total.toLocaleString('en-IN')} has been confirmed! Track here: http://localhost:5173/order-tracking/${newOrder.id}`);

  return newOrder;
};

// Simulation workflow updates
export const updateSimulatedOrderStatus = (): void => {
  const orders = getStoredData<Order[]>('mmi_orders', []);
  let updated = false;

  const orderFlows: Record<string, Order['status']> = {
    'Pending': 'Shipped',
    'Paid': 'Shipped',
    'Failed': 'Failed',
    'Shipped': 'Delivered',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled',
    'Confirmed': 'Shipped',
    'Processing': 'Shipped',
    'Out for Delivery': 'Delivered'
  };

  const updatedOrders = orders.map(o => {
    if (o.status !== 'Delivered' && o.status !== 'Cancelled' && Math.random() < 0.25) {
      updated = true;
      const nextStatus = orderFlows[o.status] || o.status;
      
      // Dispatch status emails/SMS for simulated updates
      const user = getStoredData<Record<string, User>>('mmi_users', {})[o.shippingAddress.phone] || getCurrentSessionUser();
      const customerEmail = user?.email || 'customer@madmood.in';
      const customerName = user ? `${user.firstName} ${user.lastName}` : o.shippingAddress.label;
      
      const newO = { ...o, status: nextStatus };
      
      const statusHtml = getOrderStatusEmailHtml(newO, customerName);
      sendEmail(customerEmail, `MAD MOOD: ORDER STATUS UPDATE - ${o.id}`, statusHtml);
      sendSMS(o.shippingAddress.phone, `MAD MOOD: Your order ${o.id} status has been updated to: ${nextStatus}. Track: http://localhost:5173/order-tracking/${o.id}`);
      
      if (isFirebaseEnabled && db) {
        setDoc(doc(db, 'orders', o.id), newO).catch(err => console.error('Firestore order update sync error:', err));
      }
      return newO;
    }
    return o;
  });

  if (updated) {
    setStoredData('mmi_orders', updatedOrders);
  }
};

// Admin Database API Extensions
export const getAllOrdersAdmin = (): Order[] => {
  return getStoredData<Order[]>('mmi_orders', []);
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getAllOrdersAdmin();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    const oldStatus = orders[idx].status;
    orders[idx].status = status;
    setStoredData('mmi_orders', orders);
    
    // Sync status change to Firebase
    if (isFirebaseEnabled && db) {
      setDoc(doc(db, 'orders', orderId), orders[idx]).catch(err => console.error('Firestore sync error:', err));
    }

    // Trigger status update notifications if status actually changed
    if (oldStatus !== status) {
      const user = getStoredData<Record<string, User>>('mmi_users', {})[orders[idx].shippingAddress.phone] || getCurrentSessionUser();
      const customerEmail = user?.email || 'customer@madmood.in';
      const customerName = user ? `${user.firstName} ${user.lastName}` : orders[idx].shippingAddress.label;
      
      const statusHtml = getOrderStatusEmailHtml(orders[idx], customerName);
      sendEmail(customerEmail, `MAD MOOD: ORDER STATUS UPDATE - ${orderId}`, statusHtml);
      
      sendSMS(orders[idx].shippingAddress.phone, `MAD MOOD: Your order ${orderId} has been updated to: ${status}. Track: http://localhost:5173/order-tracking/${orderId}`);
    }
  }
};

export const cancelOrder = (orderId: string): void => {
  updateOrderStatus(orderId, 'Cancelled');
};

export const getUsersAdmin = (): User[] => {
  const usersMap = getStoredData<Record<string, User>>('mmi_users', {});
  return Object.values(usersMap);
};

// Product Management
export const addProductAdmin = (product: Product): void => {
  const products = getProducts();
  products.unshift(product);
  setStoredData('mmi_products', products);

  // Sync added product to Firebase
  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'products', product.id), product).catch((err: any) => console.error('Firestore sync error:', err));
  }
};

export const updateProductAdmin = (product: Product): void => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === product.id);
  if (idx !== -1) {
    products[idx] = product;
    setStoredData('mmi_products', products);

    // Sync updated product to Firebase
    if (isFirebaseEnabled && db) {
      setDoc(doc(db, 'products', product.id), product).catch((err: any) => console.error('Firestore sync error:', err));
    }
  }
};

export const deleteProductAdmin = (id: string): void => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  setStoredData('mmi_products', filtered);

  // Sync deleted product to Firebase
  if (isFirebaseEnabled && db) {
    deleteDoc(doc(db, 'products', id)).catch((err: any) => console.error('Firestore sync error:', err));
  }
};

// Banners & Popup settings
export interface PopupSettings {
  title: string;
  text: string;
  promoCode: string;
  delay: number;
  image: string;
  isActive: boolean;
}

export const getPopupSettings = (): PopupSettings => {
  const defaultSettings: PopupSettings = {
    title: 'JOIN THE MAD CLUB',
    text: 'Subscribe to our premium launch lists. Get early drop alerts, exclusive catalogs, and FLAT 15% OFF on your first order.',
    promoCode: 'MOOD15',
    delay: 3,
    image: '',
    isActive: true
  };
  return getStoredData<PopupSettings>('mmi_popup_settings', defaultSettings);
};

export const savePopupSettings = (settings: PopupSettings): void => {
  setStoredData('mmi_popup_settings', settings);

  // Sync popup settings to Firebase
  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'settings', 'popup'), settings).catch((err: any) => console.error('Firestore settings sync error:', err));
  }
};

export interface BannerSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
}

export const getBannersSettings = (): BannerSlide[] => {
  const defaultSlides: BannerSlide[] = [
    {
      title: 'ELEVATED LINEN CAPSULES',
      subtitle: 'SUMMER COLLECTION',
      description: 'Breathable Egyptian linen casual shirts spun in organic weaves. Clean structures for modern silhouettes.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1600',
      link: '/shop?category=Premium%20Shirts'
    },
    {
      title: 'SIGNATURE PIQUE COLLARS',
      subtitle: 'PREMIUM POLO COLLECTION',
      description: 'Double-knitted combed cotton pique polos accented with stripe cuffs. Elevating everyday luxury casuals.',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1600',
      link: '/shop?category=Polo T-Shirts'
    },
    {
      title: 'REDEFINING STREETWEAR',
      subtitle: 'STREETWEAR COLLECTION',
      description: 'Comfort French Terry pullover hoodies and drop-shoulder t-shirts. Designed for loose relaxed drapes.',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1600',
      link: '/shop?category=Oversized T-Shirts'
    },
    {
      title: 'BOX-CUT HEAVYWEIGHTS',
      subtitle: 'OVERSIZED FITS',
      description: 'Street-inspired boxy tees built from 240 GSM heavy combed cotton. Structure that keeps its shape.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1600',
      link: '/shop?category=Oversized T-Shirts'
    },
    {
      title: 'SHARP TAILORED DRESSING',
      subtitle: 'FORMAL WEAR',
      description: 'Crisp Oxford button-downs and structured formal shirts. Designed with precision fits for the modern executive.',
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=1600',
      link: '/shop?category=Premium%20Shirts'
    },
    {
      title: 'HANDCRAFTED SNEAKERS',
      subtitle: 'SNEAKERS COLLECTION',
      description: 'Minimalist low-tops handcrafted from genuine Italian calfskin leather. Premium anti-skid rubber cup soles.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1600',
      link: '/shop?category=Sneakers'
    },
    {
      title: 'CONTEMPORARY ETHNIC STYLE',
      subtitle: 'FESTIVE COLLECTION',
      description: 'Rich silk-blend short kurtas and elevated ethnic shirts. Blending Indian heritage styling with clean cuts.',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1600',
      link: '/shop'
    },
    {
      title: 'PREMIUM EVERYDAY STYLE',
      subtitle: 'NEW ARRIVALS',
      description: 'Explore the latest design drops. Refined shirts, structured bottoms, and luxury accessories.',
      image: 'https://images.unsplash.com/photo-1620012253295-c05cb127c213?auto=format&fit=crop&q=80&w=1600',
      link: '/shop'
    }
  ];

  const stored = localStorage.getItem('mmi_banners_settings');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as BannerSlide[];
      if (parsed.length === 8) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored banners:', e);
    }
  }

  setStoredData('mmi_banners_settings', defaultSlides);
  return defaultSlides;
};

export const saveBannersSettings = (slides: BannerSlide[]): void => {
  setStoredData('mmi_banners_settings', slides);

  // Sync banners to Firebase
  if (isFirebaseEnabled && db) {
    setDoc(doc(db, 'settings', 'banners'), { slides }).catch((err: any) => console.error('Firestore banners sync error:', err));
  }
};

// Synchronize from Firebase Firestore (Asynchronous)
export const syncFromFirebase = async (): Promise<void> => {
  if (!isFirebaseEnabled || !db) return;
  try {
    // 1. Sync Products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const productsList: Product[] = [];
    productsSnapshot.forEach(doc => {
      productsList.push(doc.data() as Product);
    });
    if (productsList.length > 0) {
      setStoredData('mmi_products', productsList);
    } else {
      // If Firestore is empty, initialize it with INITIAL_PRODUCTS
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      setStoredData('mmi_products', INITIAL_PRODUCTS);
    }

    // 2. Sync Orders
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const ordersList: Order[] = [];
    ordersSnapshot.forEach(doc => {
      ordersList.push(doc.data() as Order);
    });
    setStoredData('mmi_orders', ordersList);

    // 3. Sync Users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersMap: Record<string, User> = {};
    usersSnapshot.forEach(doc => {
      usersMap[doc.id] = doc.data() as User;
    });
    if (Object.keys(usersMap).length > 0) {
      setStoredData('mmi_users', usersMap);
    }

    // 4. Sync Settings
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    settingsSnapshot.forEach(doc => {
      if (doc.id === 'popup') {
        setStoredData('mmi_popup_settings', doc.data() as PopupSettings);
      } else if (doc.id === 'banners') {
        const data = doc.data() as { slides: BannerSlide[] };
        setStoredData('mmi_banners_settings', data.slides);
      }
    });
  } catch (error) {
    console.error('Error syncing from Firestore:', error);
  }
};
