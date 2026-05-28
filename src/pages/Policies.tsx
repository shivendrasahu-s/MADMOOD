import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  RotateCcw,
  Truck,
  RefreshCw,
  XOctagon,
  ShieldCheck,
  FileText,
  CreditCard,
  ShoppingBag,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export const Policies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'returns';

  // Ticket Form States
  const [ticketCategory, setTicketCategory] = useState('Return Request');
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketOrder, setTicketOrder] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; date: string } | null>(null);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
    setSubmittedTicket(null);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketPhone || !ticketMessage) {
      alert('ERROR: Please fill out all required fields.');
      return;
    }

    // Generate random premium ticket ID
    const ticketId = `MM-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentDate = new Date().toLocaleString();
    setSubmittedTicket({ id: ticketId, date: currentDate });

    // Reset fields
    setTicketName('');
    setTicketEmail('');
    setTicketPhone('');
    setTicketOrder('');
    setTicketMessage('');
  };

  const tabs: TabItem[] = [
    { id: 'returns', label: 'Return & Refund Policy', icon: RotateCcw },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'exchange', label: 'Exchange Policy', icon: RefreshCw },
    { id: 'cancellation', label: 'Cancellation Policy', icon: XOctagon },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'payment', label: 'Payment Policy', icon: CreditCard },
    { id: 'order', label: 'Order Policy', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery Policy', icon: Truck },
    { id: 'contact', label: 'Contact & Support', icon: Phone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle }
  ];

  const faqs = [
    {
      q: 'HOW DO I TRACK MY ACTIVE ORDER Dispatch?',
      a: 'Once your order is verified and dispatched, you will receive a tracking ID via SMS and Email. Enter this on our Order Tracking page or courier portal to see active status.'
    },
    {
      q: 'HOW TO RETURN OR EXCHANGE A PRODUCT?',
      a: 'Log into your customer dashboard, locate your order, and click "Request Return" or "Request Exchange" within 7 days. Ensure tags are attached and the product is unused.'
    },
    {
      q: 'HOW LONG DOES DELIVERY TAKE?',
      a: 'Deliveries typically take between 3 to 7 business days across India, depending on location. Deliveries to remote regions may take up to 10 days.'
    },
    {
      q: 'IS CASH ON DELIVERY (COD) AVAILABLE?',
      a: 'Yes, Cash on Delivery is available for orders above ₹499. Please note that COD orders require automated phone OTP verification prior to dispatch.'
    },
    {
      q: 'HOW DOES THE REFUND SYSTEM WORK?',
      a: 'Once your returned product is received and passes quality inspection at our warehouse, refunds are initiated immediately. Funds reflect in your original payment method in 5-7 business days.'
    },
    {
      q: 'HOW TO CONTACT CUSTOMER SUPPORT CHANNELS?',
      a: 'You can reach us directly via email at shivendrasahu002@gmail.com, call our customer support helpline at +91 6386376901, or submit a support ticket via this portal.'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container">
        {/* PAGE HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.75rem', color: 'var(--color-gold)', letterSpacing: '0.25em', fontWeight: 700 }}>
            MAD MOOD SUPPORT CORE
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', letterSpacing: '0.05em', color: 'var(--color-black)', textTransform: 'uppercase' }}>
            Help & Policies Center
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'var(--color-black)', margin: '1.25rem auto' }} />
          <p style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Welcome to the MAD MOOD service node. Browse our verified policy directory, search FAQs, or open an official support ticket.
          </p>
        </div>

        {/* WORKSPACE GRID */}
        <div className="policies-workspace-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          
          {/* Main Layout Grid */}
          <div className="policies-layout-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
            
            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="policies-sidebar-col" style={{ gridColumn: 'span 12' }}>
              <div className="sidebar-nav-card" style={{
                background: 'var(--bg-gray-light)',
                border: '1px solid var(--color-gray-border)',
                padding: '1.25rem',
                position: 'sticky',
                top: '100px',
                zIndex: 10
              }}>
                <span style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--color-gray-text)',
                  marginBottom: '1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--color-gray-border)',
                  paddingBottom: '0.5rem'
                }} className="sidebar-header-title">
                  POLICIES DIRECTORY //
                </span>
                
                {/* Horizontal scrolling navigation for mobile / grid layout */}
                <div className="sidebar-nav-links" style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem'
                }}>
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className="hover-trigger"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '0.75rem 1rem',
                          background: isActive ? 'var(--color-black)' : 'transparent',
                          color: isActive ? 'var(--bg-white)' : 'var(--color-gray-text)',
                          border: '1px solid',
                          borderColor: isActive ? 'var(--color-black)' : 'transparent',
                          borderRadius: 0,
                          fontSize: '0.8rem',
                          fontWeight: isActive ? 700 : 500,
                          fontFamily: 'var(--font-heading)',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        <IconComponent size={14} style={{ flexShrink: 0 }} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* RIGHT VIEWPORT CONTENT */}
            <main className="policies-content-col" style={{ gridColumn: 'span 12' }}>
              <div className="policies-card-panel" style={{
                border: '1px solid var(--color-gray-border)',
                padding: '2.5rem',
                background: '#ffffff'
              }}>
                
                {/* 1. RETURNS & REFUNDS */}
                {activeTab === 'returns' && (
                  <div>
                    <h2 style={contentTitleStyle}><RotateCcw size={22} style={iconMarginStyle} /> RETURN & REFUND POLICY</h2>
                    <p style={paragraphStyle}>
                      At <strong>MAD MOOD</strong>, we design luxury apparel engineered for ultimate self-expression. If you are not completely satisfied with your order, we offer a seamless returns system within <strong>7 days</strong> of delivery.
                    </p>

                    <div style={badgeBoxStyle}>
                      <AlertCircle size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>CRITICAL DIRECTIVES:</strong>
                        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                          <li>Returns must be requested within exactly 7 days of package delivery confirmation.</li>
                          <li>Products must be completely unused, unwashed, and undamaged.</li>
                          <li>All original designer tags, sizing bar tags, and plastic zip bags must remain attached.</li>
                        </ul>
                      </div>
                    </div>

                    <h3 style={sectionHeadingStyle}>NON-RETURNABLE ITEMS</h3>
                    <p style={paragraphStyle}>
                      To maintain strict hygiene parameters for our global customer collective, the following items are strictly non-returnable:
                    </p>
                    <ul style={listStyle}>
                      <li>Innerwear and undergarments.</li>
                      <li>Products that have been washed, perfumed, ironed, or modified.</li>
                      <li>Products with signs of customer-inflicted wear, stains, or physical damage.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>RETURN REQUEST PROCESS</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
                      <div style={stepCardStyle}>
                        <span style={stepNumStyle}>01</span>
                        <div>
                          <h4 style={stepTitleStyle}>INITIATE NODE</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                            Go to your <strong>Dashboard</strong>, find the order under transaction archives, and select the item you wish to return. Alternately, submit a request via the <button onClick={() => handleTabChange('contact')} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', textDecoration: 'underline', padding: 0, font: 'inherit', fontWeight: 'bold', cursor: 'pointer' }}>Support gateway</button>.
                          </p>
                        </div>
                      </div>
                      <div style={stepCardStyle}>
                        <span style={stepNumStyle}>02</span>
                        <div>
                          <h4 style={stepTitleStyle}>COURIER PICKUP</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                            Our express courier partner will arrive at your address within 48-72 hours to pick up the package. Hand over the items inside the original boxes with original invoice nodes.
                          </p>
                        </div>
                      </div>
                      <div style={stepCardStyle}>
                        <span style={stepNumStyle}>03</span>
                        <div>
                          <h4 style={stepTitleStyle}>QUALITY CONTROL AUDIT</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                            Once received at our fulfillment center, the item goes through our official Quality Inspection check to verify tags and condition.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 style={sectionHeadingStyle}>REFUND TIMELINES</h3>
                    <p style={paragraphStyle}>
                      Approved refunds are initiated immediately. Depending on the selected mode of checkout:
                    </p>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>PAYMENT METHOD</th>
                          <th style={thStyle}>PROCESSING NODE</th>
                          <th style={thStyle}>REFUND CREDIT WINDOW</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={tdStyle}>UPI / Net Banking</td>
                          <td style={tdStyle}>Original Source</td>
                          <td style={tdStyle}>3 - 5 Business Days</td>
                        </tr>
                        <tr>
                          <td style={tdStyle}>Credit / Debit Cards</td>
                          <td style={tdStyle}>Original Card Gateway</td>
                          <td style={tdStyle}>5 - 7 Business Days</td>
                        </tr>
                        <tr>
                          <td style={tdStyle}>Cash on Delivery (COD)</td>
                          <td style={tdStyle}>Bank Transfer Node</td>
                          <td style={tdStyle}>5 - 7 Business Days (After details provided)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. SHIPPING POLICY */}
                {activeTab === 'shipping' && (
                  <div>
                    <h2 style={contentTitleStyle}><Truck size={22} style={iconMarginStyle} /> SHIPPING POLICY</h2>
                    <p style={paragraphStyle}>
                      We process and dispatch our luxury apparel orders with extreme precision. We ensure secure, tracked shipments directly to our customer addresses across India.
                    </p>

                    <h3 style={sectionHeadingStyle}>SHIPPING RATES & ORDER LIMITS</h3>
                    <p style={paragraphStyle}>
                      Delivery parameters are calculated dynamically based on total order valuation:
                    </p>
                    <ul style={listStyle}>
                      <li><strong>Orders Above ₹999:</strong> Free Shipping nationwide.</li>
                      <li><strong>Orders Below ₹999:</strong> Flat shipping charge of ₹99 applied at checkout.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>ESTIMATED DELIVERY TIMELINES</h3>
                    <p style={paragraphStyle}>
                      Standard dispatch cycle begins within 24 hours of successful payment authorization or COD verification:
                    </p>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>REGION</th>
                          <th style={thStyle}>COURIER PRIORITY</th>
                          <th style={thStyle}>ESTIMATED ARRIVAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={tdStyle}>Metro Cities (Delhi, Mumbai, Bengaluru, etc.)</td>
                          <td style={tdStyle}>Express Air Cargo</td>
                          <td style={tdStyle}>2 - 4 Business Days</td>
                        </tr>
                        <tr>
                          <td style={tdStyle}>Tier-2 & Tier-3 Cities</td>
                          <td style={tdStyle}>Surface Express</td>
                          <td style={tdStyle}>4 - 7 Business Days</td>
                        </tr>
                        <tr>
                          <td style={tdStyle}>Remote Areas & J&K / North East India</td>
                          <td style={tdStyle}>Standard Carrier Mode</td>
                          <td style={tdStyle}>7 - 10 Business Days</td>
                        </tr>
                      </tbody>
                    </table>

                    <h3 style={sectionHeadingStyle}>DELAY HANDLING & HOLIDAYS</h3>
                    <p style={paragraphStyle}>
                      Dispatches do not occur on Sundays and public holidays. In rare situations of bad weather, regional strikes, or courier terminal overload, shipping delays may happen. We will actively update you via Email and SMS if your delivery exceeds 7 business days.
                    </p>

                    <h3 style={sectionHeadingStyle}>PREMIUM LOGISTICS PARTNERS</h3>
                    <p style={paragraphStyle}>
                      We ship packages in sealed security envelopes using premium logistics networks:
                      <br />
                      <strong>Blue Dart // Delhivery // Xpressbees // Shadowfax // DTDC</strong>
                    </p>
                  </div>
                )}

                {/* 3. EXCHANGE POLICY */}
                {activeTab === 'exchange' && (
                  <div>
                    <h2 style={contentTitleStyle}><RefreshCw size={22} style={iconMarginStyle} /> EXCHANGE POLICY</h2>
                    <p style={paragraphStyle}>
                      If the sizing of your MAD MOOD product is not a perfect fit, or if you received an incorrect configuration, you can request an exchange easily within <strong>7 days</strong> of delivery.
                    </p>

                    <h3 style={sectionHeadingStyle}>EXCHANGE GUIDELINES</h3>
                    <p style={paragraphStyle}>
                      Exchanges are authorized only under the following conditions:
                    </p>
                    <ul style={listStyle}>
                      <li><strong>Size Exchange:</strong> Swap your product for a larger or smaller size of the identical item code.</li>
                      <li><strong>Defective Items:</strong> If the received garment shows manufacturing faults or damaged seams.</li>
                      <li><strong>Wrong Configuration:</strong> If the style or color delivered differs from your checkout invoice.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>ESSENTIAL CONDITIONS</h3>
                    <ul style={listStyle}>
                      <li>The exchange request must be initiated within 7 days of package delivery.</li>
                      <li>Items must be unused, unwashed, and with all original tags attached.</li>
                      <li>Exchanges are subject to live warehouse inventory levels. If the requested size is out of stock, we will issue a store credit refund.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>HOW THE EXCHANGE CYCLE WORKS</h3>
                    <p style={paragraphStyle}>
                      Once approved, we will arrange a reverse pickup of the original package. When the item arrives at our warehouse and passes QC inspection, the replacement item is dispatched immediately. There are no additional shipping fees for size exchanges or defective item replacements.
                    </p>
                  </div>
                )}

                {/* 4. CANCELLATION POLICY */}
                {activeTab === 'cancellation' && (
                  <div>
                    <h2 style={contentTitleStyle}><XOctagon size={22} style={iconMarginStyle} /> CANCELLATION POLICY</h2>
                    <p style={paragraphStyle}>
                      We understand that plans can change. Here is the operational protocol regarding order cancellations on our portal:
                    </p>

                    <h3 style={sectionHeadingStyle}>PRE-DISPATCH CANCELLATIONS</h3>
                    <p style={paragraphStyle}>
                      You can cancel your order directly from your Customer Dashboard or by contacting customer support before the order has been marked as <strong>Dispatched</strong>. If the order is cancelled during this phase, a 100% refund is credited back to your original payment node (for prepaid transactions).
                    </p>

                    <h3 style={sectionHeadingStyle}>POST-DISPATCH PROTOCOL</h3>
                    <div style={badgeBoxStyle}>
                      <AlertCircle size={18} color="var(--color-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>IMPORTANT RESTRICTION:</strong>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                          Once your package is hand-shaked with the logistics courier and marked as "Dispatched", the order CANNOT be cancelled.
                        </p>
                      </div>
                    </div>
                    <p style={paragraphStyle}>
                      If you still do not want the order, you may refuse delivery when the courier partner attempts handoff. The package will return to our warehouse, and we will initiate a refund minus standard cancellation logistical costs.
                    </p>

                    <h3 style={sectionHeadingStyle}>REFUND PROCESSING FOR CANCELLED ORDERS</h3>
                    <p style={paragraphStyle}>
                      Prepaid cancellations trigger refunds immediately. Funds will be credited to the original payment source (UPI, Card, Net Banking) within 3-5 business days.
                    </p>
                  </div>
                )}

                {/* 5. PRIVACY POLICY */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 style={contentTitleStyle}><ShieldCheck size={22} style={iconMarginStyle} /> PRIVACY POLICY</h2>
                    <p style={paragraphStyle}>
                      MAD MOOD is committed to preserving the integrity, confidentiality, and security of our customer information. This document describes how your data is collected, stored, and utilized.
                    </p>

                    <h3 style={sectionHeadingStyle}>DATA WE COLLECT</h3>
                    <p style={paragraphStyle}>
                      We process data necessary to fulfill your fashion orders and improve your shopping experience:
                    </p>
                    <ul style={listStyle}>
                      <li><strong>Identity Records:</strong> Name, phone number, email address, delivery and billing coordinates.</li>
                      <li><strong>Transaction Records:</strong> History of orders placed, active carts, and search history.</li>
                      <li><strong>Device Information:</strong> IP address, device specifications, browser type, and browser cookies.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>DATA USAGE PRINCIPLES</h3>
                    <p style={paragraphStyle}>
                      Your data is utilized solely for system operations:
                    </p>
                    <ul style={listStyle}>
                      <li>Fulfilling order verification and shipping dispatches.</li>
                      <li>Sending order tracking notifications, invoice receipts, and secure OTP verification codes.</li>
                      <li>Providing tailored collection drop notifications and newsletter updates (with opt-out choice).</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>SECURITY ARCHITECTURE</h3>
                    <p style={paragraphStyle}>
                      All data logs are stored securely using modern high-grade database encryption algorithms. Payment processing is completely tokenized and handles all transactions via PCI-DSS compliant secure gateways. MAD MOOD does not access or store your raw card details or banking passwords.
                    </p>

                    <div style={badgeBoxStyle}>
                      <ShieldCheck size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>OUR PLEDGE:</strong>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                          We do NOT sell, lease, trade, or distribute customer details to third-party marketing companies. Your information stays within our verified network.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TERMS & CONDITIONS */}
                {activeTab === 'terms' && (
                  <div>
                    <h2 style={contentTitleStyle}><FileText size={22} style={iconMarginStyle} /> TERMS & CONDITIONS</h2>
                    <p style={paragraphStyle}>
                      Welcome to MAD MOOD. By browsing and purchasing from this website, you agree to comply with and be bound by the following terms of usage.
                    </p>

                    <h3 style={sectionHeadingStyle}>WEBSITE USAGE RULES</h3>
                    <p style={paragraphStyle}>
                      Accessing the website signifies you are at least 18 years of age or are accessing under parental supervision. The site is intended solely for personal shopping. Prohibited actions include:
                    </p>
                    <ul style={listStyle}>
                      <li>Replicating, selling, or reverse-engineering web designs or logic scripts.</li>
                      <li>Attempting database breaches, injection attacks, or overloading our server nodes.</li>
                      <li>Using automated crawlers to harvest inventory pricing or catalog data.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>USER ACCOUNT RESPONSIBILITY</h3>
                    <p style={paragraphStyle}>
                      You are solely responsible for securing your profile access, including maintaining password confidentiality and securing received OTP codes. Any transaction registered under your verified phone/email profile will be deemed authorized by you.
                    </p>

                    <h3 style={sectionHeadingStyle}>INTELLECTUAL PROPERTY RIGHTS</h3>
                    <p style={paragraphStyle}>
                      All brand assets, photoshoots, logo graphic files, typography styles, button layouts, and custom menswear designs displayed on this portal are the intellectual property of MAD MOOD and protected under copyright laws.
                    </p>

                    <h3 style={sectionHeadingStyle}>PRICING & LIMITATION OF LIABILITY</h3>
                    <p style={paragraphStyle}>
                      We reserve the right to correct pricing errors and adjust catalog stock listings without prior notice. MAD MOOD's total liability for any transaction is strictly limited to the transaction amount paid.
                    </p>
                  </div>
                )}

                {/* 7. PAYMENT POLICY */}
                {activeTab === 'payment' && (
                  <div>
                    <h2 style={contentTitleStyle}><CreditCard size={22} style={iconMarginStyle} /> PAYMENT POLICY</h2>
                    <p style={paragraphStyle}>
                      MAD MOOD processes payments through encrypted modern gateways. We accept a wide range of verified payment options for checkout safety.
                    </p>

                    <h3 style={sectionHeadingStyle}>SUPPORTED PAYMENT CHANNELS</h3>
                    <ul style={listStyle}>
                      <li><strong>UPI Nodes:</strong> Google Pay, PhonePe, Paytm, BHIM UPI, and credit card linked UPI.</li>
                      <li><strong>Credit & Debit Cards:</strong> Visa, Mastercard, RuPay, Maestro.</li>
                      <li><strong>Net Banking:</strong> All major Indian banks.</li>
                      <li><strong>Cash on Delivery (COD):</strong> Verified cash payment upon package handover.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>SECURE PAYMENT GATEWAYS</h3>
                    <p style={paragraphStyle}>
                      Our gateway integrations feature 256-bit SSL encryption systems, standard 3D Secure verification checks, and fraud-detection models to shield your online transactions.
                    </p>

                    <h3 style={sectionHeadingStyle}>DOUBLE-DEBIT HANDLING</h3>
                    <p style={paragraphStyle}>
                      In rare situations where money is debited from your account but the page displays "Payment Failed," your bank will hold the funds in suspense. The amount is automatically credited back to your account by your banking node within 24-48 hours. If the transaction remains unconfirmed after 48 hours, contact our billing desk immediately.
                    </p>
                  </div>
                )}

                {/* 8. ORDER POLICY */}
                {activeTab === 'order' && (
                  <div>
                    <h2 style={contentTitleStyle}><ShoppingBag size={22} style={iconMarginStyle} /> ORDER POLICY</h2>
                    <p style={paragraphStyle}>
                      This policy regulates order confirmations, fraud validation, and customer fulfillment responsibilities on the MAD MOOD platform.
                    </p>

                    <h3 style={sectionHeadingStyle}>ORDER PLACEMENT & CONFIRMATION</h3>
                    <p style={paragraphStyle}>
                      Orders are initialized upon checkout validation. An automated order confirmation containing your Order ID (e.g., MM-IND-123456) will be dispatched to your registered email and phone contact nodes.
                    </p>

                    <h3 style={sectionHeadingStyle}>MANDATORY VERIFICATIONS</h3>
                    <p style={paragraphStyle}>
                      To prevent fraud and duplicate shipping operations:
                    </p>
                    <ul style={listStyle}>
                      <li><strong>Prepaid Orders:</strong> Cleared automatically upon payment confirmation.</li>
                      <li><strong>COD Orders:</strong> Require mandatory phone verification via OTP. Unverified COD orders are cancelled after 48 hours.</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}>ORDER REJECTION CRITERIA</h3>
                    <p style={paragraphStyle}>
                      MAD MOOD reserves the right to reject or cancel any order. Reasons include:
                    </p>
                    <ul style={listStyle}>
                      <li>Suspected bulk commercial resale manipulation.</li>
                      <li>Incorrect or incomplete delivery addresses.</li>
                      <li>A history of multiple consecutive COD delivery refusals.</li>
                      <li>Pricing configuration errors on the catalog.</li>
                    </ul>
                  </div>
                )}

                {/* 9. DELIVERY POLICY */}
                {activeTab === 'delivery' && (
                  <div>
                    <h2 style={contentTitleStyle}><Truck size={22} style={iconMarginStyle} /> DELIVERY POLICY</h2>
                    <p style={paragraphStyle}>
                      This section outlines delivery handoff rules, delivery attempts, and customer address responsibilities.
                    </p>

                    <h3 style={sectionHeadingStyle}>DELIVERY ATTEMPTS</h3>
                    <p style={paragraphStyle}>
                      Our express courier partners will attempt delivery up to <strong>3 times</strong> at the designated address. If the customer is unreachable or refuses delivery across all 3 attempts, the shipment is returned to origin (RTO) and the order is cancelled.
                    </p>

                    <h3 style={sectionHeadingStyle}>OPEN-BOX DELIVERY</h3>
                    <div style={badgeBoxStyle}>
                      <AlertCircle size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>NOTICE:</strong>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                          We do NOT offer open-box delivery options. Customers must accept the sealed package, pay the invoice amount (for COD), and sign the delivery sheet prior to opening the box.
                        </p>
                      </div>
                    </div>

                    <h3 style={sectionHeadingStyle}>DAMAGE & MISSING PARTS PROTOCOL</h3>
                    <p style={paragraphStyle}>
                      To claim damages or missing items from shipments, customers must record an unboxing video showing the sealed state of the outer courier bag and the subsequent opening. Any damage claims must be filed within 24 hours of delivery.
                    </p>
                  </div>
                )}

                {/* 10. CONTACT & SUPPORT */}
                {activeTab === 'contact' && (
                  <div>
                    <h2 style={contentTitleStyle}><Mail size={22} style={iconMarginStyle} /> CONTACT & SUPPORT POLICY</h2>
                    <p style={paragraphStyle}>
                      Have a query or need assistance with your order? Our customer support desk is available to assist you.
                    </p>

                    {/* CONTACT CARD GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
                      <div style={contactCardStyle}>
                        <MapPin size={18} color="var(--color-gold)" style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-black)', fontFamily: 'var(--font-heading)' }}>HEADQUARTERS</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-text)', lineHeight: '1.4' }}>
                          MAD MOOD Office
                          <br />
                          Unnao, Uttar Pradesh
                          <br />
                          India - 209801
                        </p>
                      </div>

                      <div style={contactCardStyle}>
                        <Phone size={18} color="var(--color-gold)" style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-black)', fontFamily: 'var(--font-heading)' }}>CALL DIRECTLINE</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-text)', lineHeight: '1.4' }}>
                          <a href="tel:+916386376901" style={{ color: 'var(--color-black)', textDecoration: 'none', fontWeight: 'bold' }}>+91 6386376901</a>
                          <br />
                          Mon-Sat: 10:00 AM - 7:00 PM IST
                        </p>
                      </div>

                      <div style={contactCardStyle}>
                        <Mail size={18} color="var(--color-gold)" style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-black)', fontFamily: 'var(--font-heading)' }}>OFFICIAL EMAIL</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-text)', lineHeight: '1.4' }}>
                          <a href="mailto:shivendrasahu002@gmail.com" style={{ color: 'var(--color-black)', textDecoration: 'underline' }}>shivendrasahu002@gmail.com</a>
                        </p>
                      </div>
                    </div>

                    {/* OWNERSHIP BLOCK */}
                    <div style={{
                      background: 'var(--bg-gray-light)',
                      border: '1px solid var(--color-gray-border)',
                      padding: '1.5rem',
                      marginBottom: '2.5rem'
                    }}>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gray-text)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.15em', fontWeight: 800 }}>
                        CORPORATE LOGISTICAL OPERATORS //
                      </span>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-black)', lineHeight: '1.6' }}>
                        MAD MOOD brand is powered by:
                        <br />
                        <strong>Mr. Pushpendra Sahu // Mr. Shivendra Sahu // Mr. Dipendra Sahu</strong>
                      </p>
                    </div>

                    {/* TICKETING FORM SECTION */}
                    <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '2rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-black)', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                        OPEN A SUPPORT TICKET
                      </h3>

                      {submittedTicket ? (
                        <div style={{
                          border: '1px solid var(--color-success)',
                          background: 'rgba(43, 138, 62, 0.03)',
                          padding: '2rem',
                          textAlign: 'center',
                          animation: 'fadeIn 0.4s ease'
                        }}>
                          <CheckCircle size={40} color="var(--color-success)" style={{ margin: '0 auto 1rem auto' }} />
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-success)', fontSize: '1.1rem' }}>TICKET DEPLOYED SUCCESSFULLY</h4>
                          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--color-gray-text)' }}>
                            Your support ticket is registered in our tracking index. Our support coordinators will audit this details.
                          </p>

                          {/* Ticket receipt box */}
                          <div style={{
                            background: '#ffffff',
                            border: '1px dashed var(--color-gray-border)',
                            padding: '1.25rem',
                            maxWidth: '350px',
                            margin: '0 auto',
                            textAlign: 'left',
                            fontSize: '0.8rem',
                            fontFamily: 'monospace'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span>TICKET ID:</span>
                              <strong style={{ color: 'var(--color-black)' }}>{submittedTicket.id}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span>TIMESTAMP:</span>
                              <span>{submittedTicket.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>STATUS:</span>
                              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>QUEUED FOR AUDIT</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setSubmittedTicket(null)}
                            className="hover-trigger"
                            style={{
                              marginTop: '1.5rem',
                              background: 'transparent',
                              border: '1px solid var(--color-black)',
                              padding: '0.5rem 1.25rem',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              borderRadius: 0,
                              cursor: 'pointer'
                            }}
                          >
                            Create New Ticket
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                              <label style={labelStyle}>YOUR NAME *</label>
                              <input
                                type="text"
                                style={inputStyle}
                                value={ticketName}
                                onChange={(e) => setTicketName(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>EMAIL ADDRESS *</label>
                              <input
                                type="email"
                                style={inputStyle}
                                value={ticketEmail}
                                onChange={(e) => setTicketEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                              <label style={labelStyle}>PHONE NUMBER *</label>
                              <input
                                type="tel"
                                style={inputStyle}
                                placeholder="+91"
                                value={ticketPhone}
                                onChange={(e) => setTicketPhone(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>ORDER ID (OPTIONAL)</label>
                              <input
                                type="text"
                                style={inputStyle}
                                placeholder="MM-IND-XXXXXX"
                                value={ticketOrder}
                                onChange={(e) => setTicketOrder(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={labelStyle}>TICKET CATEGORY</label>
                            <select
                              value={ticketCategory}
                              onChange={(e) => setTicketCategory(e.target.value)}
                              style={{ ...inputStyle, height: '42px', cursor: 'pointer' }}
                            >
                              <option>Return Request</option>
                              <option>Exchange Size Request</option>
                              <option>Shipping Delay Query</option>
                              <option>Payment Failure Issue</option>
                              <option>General Support Question</option>
                            </select>
                          </div>

                          <div>
                            <label style={labelStyle}>COMPREHENSIVE QUERY DETAILS *</label>
                            <textarea
                              rows={5}
                              style={{ ...inputStyle, resize: 'none' }}
                              value={ticketMessage}
                              onChange={(e) => setTicketMessage(e.target.value)}
                              placeholder="Please describe your query in detail..."
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn-primary-m hover-trigger"
                            style={{
                              alignSelf: 'flex-start',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '0.8rem 2.2rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Send size={14} /> DEPLOY TICKET
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {/* 11. FAQs */}
                {activeTab === 'faqs' && (
                  <div>
                    <h2 style={contentTitleStyle}><HelpCircle size={22} style={iconMarginStyle} /> FREQUENTLY ASKED QUESTIONS</h2>
                    <p style={paragraphStyle}>
                      Got a question about MAD MOOD? Check our verified FAQ list below.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                      {faqs.map((faq, idx) => {
                        const isOpen = activeFaq === idx;
                        return (
                          <div
                            key={idx}
                            style={{
                              border: '1px solid var(--color-gray-border)',
                              background: isOpen ? 'var(--bg-gray-light)' : 'transparent',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <button
                              onClick={() => setActiveFaq(isOpen ? null : idx)}
                              className="hover-trigger"
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.25rem',
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                color: 'var(--color-black)',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                letterSpacing: '0.05em',
                                cursor: 'pointer'
                              }}
                            >
                              <span>{faq.q}</span>
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isOpen && (
                              <div style={{
                                padding: '0 1.25rem 1.25rem 1.25rem',
                                fontSize: '0.85rem',
                                color: 'var(--color-gray-text)',
                                lineHeight: '1.6',
                                animation: 'fadeIn 0.3s ease'
                              }}>
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </main>

          </div>
        </div>
      </div>

      <style>{`
        .policies-layout-container {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .policies-layout-container {
            grid-template-columns: repeat(12, 1fr);
          }
          .policies-sidebar-col {
            grid-column: span 3 !important;
          }
          .policies-content-col {
            grid-column: span 9 !important;
          }
          .sidebar-nav-links {
            flex-direction: column !important;
            overflow-x: visible !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Styling structures
const contentTitleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontFamily: 'var(--font-heading)',
  letterSpacing: '0.05em',
  color: 'var(--color-black)',
  borderBottom: '1px solid var(--color-gray-border)',
  paddingBottom: '1rem',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center'
};

const iconMarginStyle: React.CSSProperties = {
  marginRight: '10px'
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  lineHeight: '1.6',
  color: 'var(--color-gray-text)',
  marginBottom: '1.5rem'
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: 'var(--color-black)',
  marginTop: '2rem',
  marginBottom: '0.75rem',
  textTransform: 'uppercase'
};

const listStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  lineHeight: '1.7',
  color: 'var(--color-gray-text)',
  paddingLeft: '1.5rem',
  marginBottom: '1.5rem',
  listStyleType: 'square'
};

const badgeBoxStyle: React.CSSProperties = {
  background: 'rgba(197, 168, 128, 0.04)',
  border: '1px solid rgba(197, 168, 128, 0.15)',
  padding: '1.25rem',
  marginBottom: '1.5rem',
  display: 'flex',
  gap: '12px'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.8rem',
  margin: '1.5rem 0',
  textAlign: 'left'
};

const thStyle: React.CSSProperties = {
  background: 'var(--bg-gray-light)',
  border: '1px solid var(--color-gray-border)',
  padding: '0.75rem',
  fontWeight: 700,
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-black)'
};

const tdStyle: React.CSSProperties = {
  border: '1px solid var(--color-gray-border)',
  padding: '0.75rem',
  color: 'var(--color-gray-text)'
};

const stepCardStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.25rem',
  background: 'var(--bg-gray-light)',
  border: '1px solid var(--color-gray-border)',
  padding: '1.25rem'
};

const stepNumStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--color-gold)'
};

const stepTitleStyle: React.CSSProperties = {
  margin: '0 0 4px 0',
  fontSize: '0.85rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  color: 'var(--color-black)',
  letterSpacing: '0.05em'
};

const contactCardStyle: React.CSSProperties = {
  background: 'var(--bg-gray-light)',
  border: '1px solid var(--color-gray-border)',
  padding: '1.5rem'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  color: 'var(--color-gray-text)',
  marginBottom: '0.4rem',
  letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--color-gray-border)',
  borderRadius: 0,
  padding: '0.65rem 0.9rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  color: 'var(--color-black)',
  backgroundColor: '#ffffff',
  outline: 'none'
};

export default Policies;
