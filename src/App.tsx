import React, { useState, useMemo } from 'react';
import { Layout, StaffModal } from './components/Shared';
import { WelcomeScreen, WeightScreen, CartScreen } from './screens/ShopFlow';
import { PaymentMethodScreen, QRISScreen, SuccessScreen, ReceiptScreen, BaggingScreen, ExitScreen, CardPaymentScreen } from './screens/CheckoutFlow';
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
  // CHANGE 1: Start langsung ke CART, bukan SCAN
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
    setCart(prev => [...prev, { ...product, qty: 1, weight }]);
    // CHANGE 2: Balik ke CART setelah nimbang
    setCurrentScreen(ScreenName.CART);
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
        
      // CASE SCAN DIHAPUS

      case ScreenName.WEIGHT:
        // CHANGE 3: Back button arahkan ke CART
        return <WeightScreen onAdd={handleAddWeightItem} onBack={() => setCurrentScreen(ScreenName.CART)} />;
        
      case ScreenName.CART:
        return (
            <CartScreen 
                cart={cart}
                onScan={handleScan} // Pass fungsi scan kesini
                onGoToWeight={() => setCurrentScreen(ScreenName.WEIGHT)} // Pass navigasi ke weight screen
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
                onCheckout={handleCheckout}
                onBack={() => setCurrentScreen(ScreenName.WELCOME)}
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
        // Fallback kalau state nyangkut di SCAN (misal hot reload)
        return <CartScreen 
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
        />;
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