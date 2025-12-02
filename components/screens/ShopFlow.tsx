import React, { useState, useEffect, useRef } from 'react';
import { Scan, Search, ChevronRight, Plus, Minus, Trash2, ArrowLeft, Scale, ShoppingCart } from 'lucide-react';
import { Button } from '../Shared';
import { MOCK_PRODUCTS, WEIGHT_PRODUCTS, TAX_RATE } from '../../constants';
import { Product, CartItem, formatCurrency } from '../../types';

// --- WELCOME SCREEN ---
export const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="h-full flex flex-col relative bg-white">
    {/* Hero Image Section */}
    <div className="h-[55%] bg-gray-100 relative overflow-hidden">
        <img 
            src="https://picsum.photos/id/429/800/1200" 
            alt="Store" 
            className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
    </div>

    {/* Content Section */}
    <div className="flex-1 px-8 pt-4 pb-12 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
             <div className="h-1 w-12 bg-yogya-red rounded-full"></div>
             <div className="h-1 w-4 bg-yogya-green rounded-full"></div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
          Selamat Datang di <br/>
          <span className="text-yogya-red">YOGYA</span> Center
        </h1>
        <p className="text-xl text-gray-500 font-light">
          Self-Checkout Mandiri
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="mt-1">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
                Silakan scan barang belanjaan Anda satu per satu. Untuk buah & sayur, gunakan menu "Barang Timbang".
            </p>
        </div>
        <Button onClick={onStart} fullWidth size="lg" className="shadow-yogya-red/30">
          Mulai Belanja <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  </div>
);

// --- SCAN SCREEN ---
export const ScanScreen: React.FC<{ 
  onScan: (product: Product) => void; 
  onGoToWeight: () => void;
  onGoToCart: () => void;
  cartTotal: number;
  itemCount: number;
}> = ({ onScan, onGoToWeight, onGoToCart, cartTotal, itemCount }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<Product | null>(null);

  const simulateScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    
    // Simulate processing delay
    setTimeout(() => {
        const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        onScan(randomProduct);
        setLastScanned(randomProduct);
        setIsScanning(false);
        
        // Clear success message after 2s
        setTimeout(() => setLastScanned(null), 2000);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Scanner Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6" onClick={simulateScan}>
        
        {/* Camera Feed Simulation */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/id/60/800/1200')] bg-cover bg-center pointer-events-none"></div>

        {/* Scanning Frame */}
        <div className="w-[85%] aspect-square border-2 border-yogya-green/50 rounded-3xl relative flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm cursor-pointer hover:border-yogya-green transition-colors group">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yogya-green rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yogya-green rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yogya-green rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yogya-green rounded-br-xl"></div>

            {/* Scan Laser Animation */}
            <div className="absolute left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

            {/* Icon/Text Hint */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                 <Scan className="w-16 h-16 text-white mb-4 opacity-50" />
                 <p className="text-sm font-medium tracking-wide text-center px-4">Tap area ini untuk simulasi scan</p>
            </div>
            
            {/* Scan Success Overlay */}
            {isScanning && (
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center space-y-2 z-10">
            <h2 className="text-2xl font-bold">Pindai Barcode Produk</h2>
            <p className="text-gray-400 text-sm">Arahkan barcode ke dalam kotak area scan</p>
        </div>

        {/* Feedback Toast */}
        {lastScanned && (
            <div className="absolute top-8 left-4 right-4 bg-yogya-green text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 z-50">
                <img src={lastScanned.image} alt={lastScanned.name} className="w-10 h-10 rounded bg-white object-cover" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{lastScanned.name}</p>
                    <p className="text-sm opacity-90">{formatCurrency(lastScanned.price)}</p>
                </div>
            </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-white rounded-t-3xl p-6 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.2)] z-20">
         <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Sementara</p>
                <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(cartTotal)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Keranjang</p>
                <p className="text-xl font-bold text-gray-900">{itemCount} Item</p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onGoToWeight} className="flex flex-col h-auto py-3 gap-1 items-center justify-center border-gray-200 bg-gray-50">
                <Scale className="w-6 h-6 text-yogya-yellow" />
                <span className="text-xs font-bold text-gray-700">Barang Timbang</span>
            </Button>
            <Button variant="primary" onClick={onGoToCart} disabled={itemCount === 0} className={itemCount === 0 ? 'opacity-50' : ''}>
                Bayar Sekarang
            </Button>
         </div>
      </div>
    </div>
  );
};

// --- WEIGHT SCREEN ---
export const WeightScreen: React.FC<{
  onAdd: (product: Product, weight: number) => void;
  onBack: () => void;
}> = ({ onAdd, onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [weight, setWeight] = useState(0);
  const [isWeighing, setIsWeighing] = useState(false);

  // Simulating live scale reading
  useEffect(() => {
    if (selectedProduct && !isWeighing && weight === 0) {
        setIsWeighing(true);
        let currentWeight = 0;
        const targetWeight = Number((Math.random() * 2 + 0.1).toFixed(2)); // Random weight between 0.1 and 2.1 kg
        
        const interval = setInterval(() => {
            currentWeight += 0.05;
            if (currentWeight >= targetWeight) {
                setWeight(targetWeight);
                setIsWeighing(false);
                clearInterval(interval);
            } else {
                setWeight(Number(currentWeight.toFixed(2)));
            }
        }, 50);
        return () => clearInterval(interval);
    }
  }, [selectedProduct]);

  const handleAdd = () => {
    if (selectedProduct && weight > 0) {
        onAdd(selectedProduct, weight);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
       {/* Header */}
       <div className="bg-white p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Barang Timbang</h2>
       </div>

       {/* Main Content */}
       <div className="flex-1 p-6 overflow-y-auto">
          {!selectedProduct ? (
             <div className="grid grid-cols-2 gap-4">
                {WEIGHT_PRODUCTS.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => setSelectedProduct(p)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-yogya-yellow hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
                    >
                        <img src={p.image} alt={p.name} className="w-20 h-20 object-contain" />
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatCurrency(p.price)} /kg</p>
                        </div>
                    </button>
                ))}
             </div>
          ) : (
             <div className="flex flex-col h-full">
                {/* Scale UI */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col items-center border border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 relative">
                        <Scale className={`w-10 h-10 ${isWeighing ? 'text-yogya-yellow animate-pulse' : 'text-yogya-green'}`} />
                        {isWeighing && (
                            <div className="absolute inset-0 border-4 border-yogya-yellow border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <div className="mt-6 w-full bg-gray-900 text-green-400 font-mono p-4 rounded-lg text-center text-3xl tracking-widest shadow-inner">
                        {weight.toFixed(3)} <span className="text-base text-gray-500">kg</span>
                    </div>
                    <div className="w-full mt-4 flex justify-between items-center text-sm text-gray-500 px-2">
                        <span>Harga/kg</span>
                        <span>{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    <div className="w-full mt-2 pt-2 border-t border-gray-100 flex justify-between items-center font-bold text-gray-900 px-2 text-lg">
                        <span>Total Harga</span>
                        <span>{formatCurrency(selectedProduct.price * weight)}</span>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    <Button 
                        fullWidth 
                        size="lg" 
                        disabled={isWeighing} 
                        onClick={handleAdd}
                    >
                        {isWeighing ? 'Menimbang...' : 'Tambahkan ke Keranjang'}
                    </Button>
                    <Button 
                        fullWidth 
                        variant="ghost" 
                        onClick={() => { setSelectedProduct(null); setWeight(0); }}
                    >
                        Batalkan Pilihan
                    </Button>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

// --- CART SCREEN ---
export const CartScreen: React.FC<{
    cart: CartItem[];
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    onBack: () => void;
    subtotal: number;
    tax: number;
    total: number;
}> = ({ cart, onUpdateQty, onRemove, onCheckout, onBack, subtotal, tax, total }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 flex items-center gap-4 border-b border-gray-200 shadow-sm z-10">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Keranjang Belanja</h2>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm truncate pr-2">{item.name}</h3>
                                {item.weight && (
                                    <p className="text-xs text-gray-500 mt-0.5">{item.weight} kg @ {formatCurrency(item.price)}/kg</p>
                                )}
                            </div>
                            <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                            <p className="font-bold text-yogya-red">{formatCurrency(item.price * (item.weight || 1) * item.qty)}</p>
                            
                            {!item.isWeighted && (
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                                    <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-30" disabled={item.qty <= 1}>
                                        <Minus className="w-3 h-3 text-gray-700" />
                                    </button>
                                    <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.qty}</span>
                                    <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm">
                                        <Plus className="w-3 h-3 text-gray-700" />
                                    </button>
                                </div>
                            )}
                            {item.isWeighted && (
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {item.weight}kg x {item.qty}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Summary Footer */}
        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 z-20">
            <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>PPN (11%)</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total Akhir</span>
                    <span className="font-bold text-yogya-red text-xl">{formatCurrency(total)}</span>
                </div>
            </div>

            <Button fullWidth size="lg" onClick={onCheckout}>
                Lanjut Pembayaran
            </Button>
        </div>
    </div>
  );
};