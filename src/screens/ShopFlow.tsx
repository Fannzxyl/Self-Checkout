import React, { useState, useEffect } from 'react';
import { ChevronRight, Trash2, ArrowLeft, Scale, ShoppingCart, ScanLine, Zap, Loader2, Plus, Minus, Check } from 'lucide-react';
import { Button } from '../components/Shared';
import { NetworkToast } from '../components/NetworkToast'; 
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
            <img src={logoYogya} alt="Yogya Group" className="h-20 w-auto object-contain" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3 mt-4 ml-2">
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
  
  // STATE BARU: Menyimpan barang sementara hasil scan (sebelum masuk keranjang)
  const [tempScannedProduct, setTempScannedProduct] = useState<Product | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // STATE UNTUK TIMER (PROGRES BAR JEDA)
  const [autoScanProgress, setAutoScanProgress] = useState(0);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // FUNGSI 1: Handle Simulasi Scan -> Buka Pop-up
  const handleSimulatedScan = () => {
    // Kalau sedang menampilkan pop-up, jangan scan dulu (prevent spam)
    if (tempScannedProduct) return;

    const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    if (randomProduct) {
        setTempScannedProduct(randomProduct);
        setAutoScanProgress(0); // Reset progress
    }
  };

  // LOGIK BARU: AUTO ADD DENGAN JEDA 2 DETIK
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (tempScannedProduct) {
        // 1. Jalankan Timer buat animasi loading bar (biar smooth 0-100%)
        progressTimer = setInterval(() => {
            setAutoScanProgress((prev) => Math.min(prev + 5, 100)); // Nambah 5% tiap 100ms = 2 detik total
        }, 100);

        // 2. Jalankan Timer buat masukin keranjang setelah 2 detik
        timer = setTimeout(() => {
            onScan(tempScannedProduct); // Masukin keranjang
            setTempScannedProduct(null); // Tutup pop-up
            setAutoScanProgress(0);
        }, 2000);
    }

    return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
    };
  }, [tempScannedProduct, onScan]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (e.key === 'Enter') {
            if (barcodeBuffer.length > 0) {
                handleSimulatedScan(); 
            }
            setBarcodeBuffer('');
        } else if (e.key.length === 1) {
            setBarcodeBuffer(prev => prev + e.key);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [barcodeBuffer, tempScannedProduct]); // Tambah dependency biar gak double scan

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
        <NetworkToast />

        {/* Header */}
        <div className="bg-white p-5 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900">Keranjang</h2>
                    <p className="text-xs text-gray-400 font-medium">Order ID: #{Math.floor(Math.random() * 9000) + 1000}</p>
                </div>
            </div>
            <div className="w-10"></div>
        </div>

        {/* --- POP-UP AUTO SCAN (TANPA TOMBOL) --- */}
        {tempScannedProduct && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col items-center">
                    
                    {/* Visual Loading / Spinner */}
                    <div className="absolute top-4 right-4">
                        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
                    </div>

                    <div className="w-48 h-48 mb-6 relative">
                             <div className="absolute inset-0 bg-yogya-red/10 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                             <img 
                                src={tempScannedProduct.image} 
                                alt={tempScannedProduct.name} 
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                             />
                    </div>
                        
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight text-center">
                        {tempScannedProduct.name}
                    </h3>
                    <p className="text-2xl font-bold text-yogya-red mb-8">
                        {formatCurrency(tempScannedProduct.price)}
                    </p>

                    {/* Loading Bar Otomatis */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                        <div 
                            className="bg-yogya-green h-full transition-all duration-100 ease-linear"
                            style={{ width: `${autoScanProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Memasukkan ke keranjang...</p>
                </div>
            </div>
        )}

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Empty State */}
            {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                    <ScanLine className="w-24 h-24 mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-500">Siap Memindai</h3>
                    <p className="text-sm mt-2 max-w-[200px]">Tekan tombol simulasi di bawah untuk scan barang...</p>
                </div>
            )}

            {/* List Barang */}
            {cart.length > 0 && (
                <div className="space-y-3 pb-4">
                     <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Daftar Belanjaan ({cart.reduce((a,b)=>a+b.qty,0)})</span>
                     </div>

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
                                    
                                    {/* Tampilan Qty Statis (Tanpa Tombol +/-) */}
                                    {!item.isWeighted && (
                                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200">
                                            <span className="text-xs text-gray-500 font-medium">Qty:</span>
                                            <span className="text-sm font-bold text-gray-900">{item.qty}</span>
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
        </div>

        {/* --- BUTTON SIMULASI SCAN (DI ATAS FOOTER) --- */}
        <div className="px-6 pb-2 z-20">
            <button 
                onClick={handleSimulatedScan}
                // Tombol disable saat lagi proses scanning biar gak spam
                disabled={!!tempScannedProduct} 
                className="w-full bg-gray-900 text-white py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {tempScannedProduct ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Zap className="w-5 h-5 text-yellow-400" />
                )}
                <span className="font-bold text-sm">
                    {tempScannedProduct ? 'Sedang Memindai...' : 'Simulasi Scan Barang'}
                </span>
            </button>
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

            {/* BUTTON GROUP FOOTER */}
            <div className="grid grid-cols-2 gap-3">
                <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={onGoToWeight}
                    className="border-2 border-yogya-yellow/50 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 hover:border-yogya-yellow"
                >
                    <Scale className="w-5 h-5 mr-1" />
                    Timbang
                </Button>
                
                {/* Tombol Bayar disabled kalau cart kosong ATAU offline */}
                <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={onCheckout} 
                    disabled={cart.length === 0 || !isOnline}
                >
                    {isOnline ? 'Bayar' : 'Offline'}
                    {isOnline && <ChevronRight className="w-5 h-5 ml-1" />}
                </Button>
            </div>
        </div>
    </div>
  );
};