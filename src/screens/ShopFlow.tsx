import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Minus, Trash2, ArrowLeft, Scale, ShoppingCart, ScanLine, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../components/Shared';
// FIX PATH: Mundur 1 langkah (..)
import { MOCK_PRODUCTS, WEIGHT_PRODUCTS } from '../constants';
import { Product, CartItem, formatCurrency } from '../types';
import logoYogya from '../assets/Yogya_Group.png';

// --- WELCOME SCREEN ---
export const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="h-full flex flex-col relative bg-white">
    <div className="h-[55%] bg-gray-100 relative overflow-hidden">
        <img 
            src="https://picsum.photos/id/429/800/1200" 
            alt="Store" 
            className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
    </div>

    <div className="flex-1 px-8 pt-4 pb-12 flex flex-col justify-between">
      <div>
        <div className="mb-6">
            <img src={logoYogya} alt="Yogya Group" className="h-16 w-auto object-contain" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
          Selamat Datang<br/>
          <span className="font-light text-2xl text-gray-500">YOGYA Supermarket</span>
        </h1>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="mt-1">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
                Silakan langsung scan barang belanjaan Anda. Untuk buah & sayur, gunakan menu "Barang Timbang".
            </p>
        </div>
        <Button onClick={onStart} fullWidth size="lg" className="shadow-yogya-red/30">
          Mulai Belanja <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  </div>
);

// --- WEIGHT SCREEN ---
export const WeightScreen: React.FC<{
  onAdd: (product: Product, weight: number) => void;
  onBack: () => void;
}> = ({ onAdd, onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [weight, setWeight] = useState(0);
  const [isWeighing, setIsWeighing] = useState(false);

  useEffect(() => {
    if (selectedProduct && !isWeighing && weight === 0) {
        setIsWeighing(true);
        let currentWeight = 0;
        const targetWeight = Number((Math.random() * 2 + 0.1).toFixed(2)); 
        
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
       <div className="bg-white p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Barang Timbang</h2>
       </div>

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
                    <Button fullWidth size="lg" disabled={isWeighing} onClick={handleAdd}>
                        {isWeighing ? 'Menimbang...' : 'Tambahkan ke Keranjang'}
                    </Button>
                    <Button fullWidth variant="ghost" onClick={() => { setSelectedProduct(null); setWeight(0); }}>
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
    onScan: (product: Product) => void;
    onGoToWeight: () => void;
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    onBack: () => void;
    subtotal: number;
    tax: number;
    total: number;
}> = ({ cart, onScan, onGoToWeight, onUpdateQty, onRemove, onCheckout, onBack, subtotal, tax, total }) => {
  
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [lastScannedName, setLastScannedName] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (e.key === 'Enter') {
            if (barcodeBuffer.length > 0) {
                const demoProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
                if (demoProduct) {
                    onScan(demoProduct);
                    setLastScannedName(demoProduct.name);
                    setTimeout(() => setLastScannedName(null), 3000);
                }
            }
            setBarcodeBuffer('');
        } else if (e.key.length === 1) {
            setBarcodeBuffer(prev => prev + e.key);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [barcodeBuffer, onScan]);

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900">Keranjang</h2>

                    <div className="flex items-center gap-3 text-xs mt-1">
                        <p className="text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            <ScanLine className="w-3 h-3" /> Scanner Aktif
                        </p>
                        <span className="text-gray-300">|</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-full border transition-colors duration-300 mt-2 w-fit ${
                        isOnline ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'
                    }`}>
                        {isOnline ? (
                            <>
                                <div className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </div>
                                <span className="text-xs">Online</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3" />
                                <span className="text-xs">Offline</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <button 
                onClick={onGoToWeight}
                className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
            >
                <Scale className="w-5 h-5" />
                <span className="text-sm font-bold">Barang Timbang</span>
            </button>
        </div>

        {/* Notifikasi Toast */}
        {lastScannedName && (
            <div className="absolute top-32 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-in slide-in-from-top-2 fade-in duration-300 flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-1">
                    <Plus className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-sm">Berhasil menambah: <b>{lastScannedName}</b></span>
            </div>
        )}

        {/* Empty State */}
        {cart.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center opacity-60">
                <ScanLine className="w-24 h-24 mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-500">Siap Memindai</h3>
                <p className="text-sm mt-2 max-w-[200px]">Silakan scan barcode barang pada alat scanner...</p>
                <p className="text-xs mt-8 bg-gray-200 px-2 py-1 rounded text-gray-500">Dev Note: Ketik keyboard & Enter untuk simulasi</p>
            </div>
        )}

        {/* List */}
        {cart.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
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
        )}

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

            <Button fullWidth size="lg" onClick={onCheckout} disabled={cart.length === 0 || !isOnline}>
                {isOnline ? 'Lanjut Pembayaran' : 'Offline - Cek Koneksi'}
            </Button>
        </div>
    </div>
  );
};