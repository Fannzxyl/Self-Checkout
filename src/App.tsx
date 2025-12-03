// src/App.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
// UPDATE: Import StaffModal juga
import { Layout, StaffModal } from './components/Shared';
import { WelcomeScreen, WeightScreen, CartScreen } from './screens/ShopFlow';
import { 
  PaymentMethodScreen, 
  QRISScreen, 
  CardPaymentScreen, 
  SuccessScreen, 
  ReceiptScreen, 
  BaggingScreen, 
  ExitScreen 
} from './screens/CheckoutFlow';
import { ScreenName, CartItem, Product, PaymentMethod } from './types';
import { TAX_RATE } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.WELCOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState('');
  
  // UPDATE: State untuk Modal Bantuan Global
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // --- DERIVED STATE ---
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * (item.weight || 1) * item.qty), 0);
  }, [cart]);

  const tax = subtotal * TAX_RATE;
  const total = Math.round(subtotal + tax);

  // --- HANDLERS ---
  const handleStart = () => setCurrentScreen(ScreenName.CART);
  
  const handleScan = (product: Product) => {
    setCart(prev => {
        const existing = prev.find(p => p.id === product.id);
        if (existing) {
            return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
        }
        return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleAddWeightItem = (product: Product, weight: number) => {
    setCart(prev => [...prev, { ...product, qty: 1, weight, isWeighted: true }]);
    setCurrentScreen(ScreenName.CART);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, qty: Math.max(0, item.qty + delta) };
        }
        return item;
    }).filter(item => item.qty > 0));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => setCurrentScreen(ScreenName.PAYMENT_METHODS);

  const handlePaymentSelect = (method: PaymentMethod) => {
    if (method === 'QRIS') setCurrentScreen(ScreenName.QRIS);
    else if (method === 'CARD') setCurrentScreen(ScreenName.CARD_PAYMENT);
  };

  const handlePaymentSuccess = () => {
    setOrderNumber(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    setCurrentScreen(ScreenName.SUCCESS);
  };

  const handleReset = () => {
    setCart([]);
    setOrderNumber('');
    setCurrentScreen(ScreenName.WELCOME);
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (currentScreen) {
      case ScreenName.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case ScreenName.CART:
        return (
            <CartScreen 
                cart={cart}
                onScan={handleScan}
                onGoToWeight={() => setCurrentScreen(ScreenName.WEIGHT)}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
                onCheckout={handleCheckout}
                onBack={() => setCurrentScreen(ScreenName.WELCOME)}
                subtotal={subtotal}
                tax={tax}
                total={total}
            />
        );
      case ScreenName.WEIGHT:
        return <WeightScreen onAdd={handleAddWeightItem} onBack={() => setCurrentScreen(ScreenName.CART)} />;
      case ScreenName.PAYMENT_METHODS:
        return (
            <PaymentMethodScreen 
                total={total}
                onSelectMethod={handlePaymentSelect}
                onBack={() => setCurrentScreen(ScreenName.CART)}
            />
        );
      case ScreenName.QRIS:
        return (
            <QRISScreen 
                total={total}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setCurrentScreen(ScreenName.PAYMENT_METHODS)}
            />
        );
      case ScreenName.CARD_PAYMENT:
        return (
            <CardPaymentScreen
                total={total}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setCurrentScreen(ScreenName.PAYMENT_METHODS)}
            />
        );
      case ScreenName.SUCCESS:
        return (
            <SuccessScreen 
                orderNumber={orderNumber}
                onViewReceipt={() => setCurrentScreen(ScreenName.RECEIPT)}
            />
        );
      case ScreenName.RECEIPT:
        return (
            <ReceiptScreen 
                cart={cart}
                subtotal={subtotal}
                tax={tax}
                total={total}
                orderNumber={orderNumber}
                onFinish={() => setCurrentScreen(ScreenName.BAGGING)}
            />
        );
      case ScreenName.BAGGING:
        return <BaggingScreen onComplete={() => setCurrentScreen(ScreenName.EXIT)} />;
      case ScreenName.EXIT:
        return <ExitScreen onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <Layout 
        screenName={currentScreen}
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
        // UPDATE: Hubungkan tombol bantuan di Header ke State
        onRequestAssistance={() => setIsHelpOpen(true)} 
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          className="h-full w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* UPDATE: Render Modal Bantuan Global di sini */}
      <StaffModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </Layout>
  );
};

export default App;