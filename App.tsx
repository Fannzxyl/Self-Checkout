import React, { useState, useMemo } from 'react';
import { Layout, StaffModal } from './components/Shared';
import { WelcomeScreen, ScanScreen, WeightScreen, CartScreen } from './components/screens/ShopFlow';
import { PaymentMethodScreen, QRISScreen, SuccessScreen, ReceiptScreen, BaggingScreen, ExitScreen, CardPaymentScreen } from './components/screens/CheckoutFlow';
import { ScreenName, CartItem, Product } from './types';
import { TAX_RATE } from './constants';

const App: React.FC = () => {
  // State
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.WELCOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isStaffAssistanceRequested, setIsStaffAssistanceRequested] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Derived State
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * (item.weight || 1) * item.qty), 0);
  }, [cart]);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Handlers
  const handleStart = () => setCurrentScreen(ScreenName.SCAN);
  
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
    setCart(prev => [...prev, { ...product, qty: 1, weight }]);
    setCurrentScreen(ScreenName.SCAN);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, qty: Math.max(1, item.qty + delta) };
        }
        return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => setCurrentScreen(ScreenName.PAYMENT_METHODS);

  const handlePaymentSelect = (method: string) => {
    if (method === 'QRIS') {
        setCurrentScreen(ScreenName.QRIS);
    } else if (method === 'CARD') {
        setCurrentScreen(ScreenName.CARD_PAYMENT);
    } else {
        // Cash still simulates delay for now or could have its own screen
        setTimeout(() => handlePaymentSuccess(), 2000);
    }
  };

  const handlePaymentSuccess = () => {
    setOrderNumber(`ORD-${Math.floor(Math.random() * 1000000)}`);
    setCurrentScreen(ScreenName.SUCCESS);
  };

  const handleReset = () => {
    setCart([]);
    setOrderNumber('');
    setCurrentScreen(ScreenName.WELCOME);
  };

  // Render Logic
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case ScreenName.SCAN:
        return (
            <ScanScreen 
                onScan={handleScan} 
                onGoToWeight={() => setCurrentScreen(ScreenName.WEIGHT)}
                onGoToCart={() => setCurrentScreen(ScreenName.CART)}
                cartTotal={total}
                itemCount={cart.reduce((a, b) => a + b.qty, 0)}
            />
        );
      case ScreenName.WEIGHT:
        return <WeightScreen onAdd={handleAddWeightItem} onBack={() => setCurrentScreen(ScreenName.SCAN)} />;
      case ScreenName.CART:
        return (
            <CartScreen 
                cart={cart}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
                onCheckout={handleCheckout}
                onBack={() => setCurrentScreen(ScreenName.SCAN)}
                subtotal={subtotal}
                tax={tax}
                total={total}
            />
        );
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
        return <div className="p-10 text-center">Screen Not Implemented</div>;
    }
  };

  return (
    <Layout 
        onRequestAssistance={() => setIsStaffAssistanceRequested(true)} 
        screenName={currentScreen}
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
    >
      {renderScreen()}
      <StaffModal 
        isOpen={isStaffAssistanceRequested} 
        onClose={() => setIsStaffAssistanceRequested(false)} 
      />
    </Layout>
  );
};

export default App;