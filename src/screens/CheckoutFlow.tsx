// src/screens/CheckoutFlow.tsx

import React, { useState, useEffect } from 'react';
import { 
    CreditCard, 
    QrCode, 
    ArrowLeft, 
    CheckCircle, 
    Receipt, 
    Mail, 
    ShoppingBag, 
    LogOut, 
    Check, 
    Wifi, 
    Lock, 
    Loader2, 
    XCircle, 
    RefreshCw 
} from 'lucide-react';
import { Button } from '../components/Shared';
import { formatCurrency, CartItem, PaymentMethod } from '../types';
import { TAX_RATE } from '../constants';

// --- IMPORT LOGO DARI ASSETS ---
import YogyaLogo from '../assets/Yogya_Group.png';

// --- PAYMENT METHOD SCREEN ---
export const PaymentMethodScreen: React.FC<{
  total: number;
  onSelectMethod: (method: PaymentMethod) => void;
  onBack: () => void;
}> = ({ total, onSelectMethod, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50/50">
        <div className="bg-white px-5 py-4 flex items-center gap-4 border-b border-gray-100 shadow-sm z-10">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Pembayaran</h2>
        </div>

        <div className="p-6">
            <div className="text-center mb-8 mt-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Tagihan</p>
                <h1 className="text-4xl font-extrabold text-yogya-red tracking-tight">{formatCurrency(total)}</h1>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 px-1">Pilih Metode Pembayaran</h3>
            
            <div className="space-y-3">
                {/* QRIS BUTTON */}
                <button 
                    onClick={() => onSelectMethod('QRIS')}
                    className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-yogya-green hover:shadow-md transition-all flex items-center gap-4 group active:scale-[0.98]"
                >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-yogya-green group-hover:text-white transition-colors">
                        <QrCode className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800">QRIS</p>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded group-hover:bg-yogya-green group-hover:text-white transition-colors">PROMO</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">GoPay, OVO, Dana, ShopeePay</p>
                    </div>
                </button>

                {/* CARD BUTTON */}
                <button 
                    onClick={() => onSelectMethod('CARD')}
                    className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-yogya-red hover:shadow-md transition-all flex items-center gap-4 group active:scale-[0.98]"
                >
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-yogya-red group-hover:text-white transition-colors">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-800">Kartu Debit / Kredit</p>
                        <p className="text-xs text-gray-500 mt-0.5">Visa, Mastercard, GPN</p>
                    </div>
                </button>
            </div>
        </div>
    </div>
  );
};

// --- CARD PAYMENT SCREEN ---
export const CardPaymentScreen: React.FC<{
    total: number;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ total, onSuccess, onCancel }) => {
    const [status, setStatus] = useState<'INSERT' | 'PROCESSING' | 'APPROVED' | 'DECLINED'>('INSERT');

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (status === 'INSERT') {
            timer = setTimeout(() => {
                setStatus('PROCESSING');
            }, 4000);
        } else if (status === 'PROCESSING') {
            timer = setTimeout(() => {
                const isApproved = Math.random() > 0.1; 
                setStatus(isApproved ? 'APPROVED' : 'DECLINED');
            }, 3000);
        } else if (status === 'APPROVED') {
            timer = setTimeout(() => {
                onSuccess();
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [status, onSuccess]);

    const handleManualTap = () => {
        if (status === 'INSERT') {
            setStatus('PROCESSING');
        }
    };

    const handleRetry = () => {
        setStatus('INSERT');
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm z-10">
                {(status === 'INSERT' || status === 'DECLINED') && (
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <h2 className="font-bold text-gray-900 text-lg">Kartu Debit / Kredit</h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                {/* Visual Section - Card Reader */}
                <div 
                    className="mb-12 relative cursor-pointer group perspective-1000" 
                    onClick={handleManualTap}
                >
                    {/* Floating Card */}
                    <div className={`w-56 h-36 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between p-5 text-white z-20 transition-all duration-700 ease-in-out border border-slate-600/50 ${
                        status === 'INSERT' ? 'group-hover:translate-y-4 group-hover:scale-105 group-active:scale-95 animate-[bounce_3s_infinite]' : 
                        status === 'PROCESSING' ? 'translate-y-10 scale-95 opacity-90' :
                        status === 'APPROVED' ? 'translate-y-10 scale-95 border-4 border-green-500 opacity-100' :
                        'translate-y-0 border-4 border-red-500'
                    }`}>
                        <div className="flex justify-between items-start">
                            <Wifi className="w-7 h-7 rotate-90 opacity-60" />
                            <div className="font-bold italic opacity-40 text-sm">BANK</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-7 bg-yellow-500/80 rounded-md"></div>
                            <div className="text-sm tracking-widest opacity-80 font-mono">•••• 1234</div>
                        </div>
                    </div>
                    
                    {/* Reader Illustration */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-14 bg-gray-100 rounded-t-2xl border-t-4 border-gray-200 z-10 shadow-inner"></div>
                    
                    {/* Status Indicator on Reader */}
                    <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full z-30 transition-colors duration-300 ${
                        status === 'INSERT' ? 'bg-blue-400 animate-pulse' : 
                        status === 'PROCESSING' ? 'bg-yellow-400 animate-pulse' : 
                        status === 'APPROVED' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,1)]' :
                        'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]'
                    }`}></div>
                </div>

                {/* Status Text & Controls */}
                <div className="space-y-4 max-w-xs mx-auto min-h-[160px] flex flex-col justify-end w-full">
                    {status === 'INSERT' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Tempel Kartu</h3>
                            <p className="text-gray-500 text-sm">Tempel atau masukkan kartu pada mesin EDC.</p>
                            <div className="mt-6 py-2 px-6 bg-gray-50 rounded-xl border border-gray-100 inline-block shadow-sm">
                                <span className="text-yogya-red font-bold text-xl">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    )}

                    {status === 'PROCESSING' && (
                        <div className="animate-in zoom-in duration-300">
                            <div className="bg-yellow-50 p-4 rounded-full inline-block mb-4">
                                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Memproses Transaksi...</h3>
                            <p className="text-gray-500 text-xs">Mohon jangan cabut kartu Anda</p>
                            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 bg-gray-50 py-1 px-3 rounded-full mx-auto w-fit">
                                <Lock className="w-3 h-3" /> Koneksi Aman Terenkripsi
                            </div>
                        </div>
                    )}

                    {status === 'APPROVED' && (
                        <div className="animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-[6px] border-white shadow-xl">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-green-600 mb-1">Berhasil!</h3>
                            <p className="text-gray-500 text-sm">Silakan ambil kartu Anda</p>
                        </div>
                    )}

                    {status === 'DECLINED' && (
                        <div className="animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-[6px] border-white shadow-xl">
                                <XCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-red-600 mb-1">Gagal</h3>
                            <p className="text-gray-500 text-sm mb-6">Kartu ditolak atau saldo kurang.</p>
                            
                            <Button onClick={handleRetry} size="sm" variant="outline" className="mx-auto border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 w-full">
                                <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- QRIS SCREEN ---
export const QRISScreen: React.FC<{
    total: number;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ total, onSuccess, onCancel }) => {
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onCancel(); // Timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Simulate payment success after 5 seconds
        const successTimer = setTimeout(() => {
            onSuccess();
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(successTimer);
        };
    }, []);

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 shadow-sm z-10">
                 <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-gray-900 text-lg">Pembayaran QRIS</h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <div className="relative mb-8">
                    {/* Pulsing Glow Effect */}
                    <div className="absolute -inset-6 bg-yogya-green/20 blur-2xl rounded-full animate-pulse"></div>

                    <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 relative z-10">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YOGYA-PAY-${total}`} alt="QR Code" className="w-48 h-48 mix-blend-darken" />
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-yogya-red text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap border-4 border-white">
                            {formatCurrency(total)}
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4">Scan QRIS</h3>
                <p className="text-gray-500 text-xs mb-8 max-w-[200px] leading-relaxed">Dukungan aplikasi: GoPay, OVO, Dana, LinkAja, BCA, Mandiri</p>

                <div className="w-full bg-white rounded-xl p-4 border border-gray-200 mb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sisa Waktu</span>
                        <span className="text-sm font-mono font-bold text-yogya-red tabular-nums">00:{countdown.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yogya-green transition-all duration-1000 ease-linear"
                            style={{ width: `${(countdown / 60) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUCCESS SCREEN (CLEAN STYLE) ---
export const SuccessScreen: React.FC<{
    orderNumber: string;
    onViewReceipt: () => void;
}> = ({ orderNumber, onViewReceipt }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center relative overflow-hidden">
            
            {/* Animated Success Icon */}
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20 duration-1000"></div>
                <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center relative shadow-lg shadow-green-100 border-4 border-white">
                    <CheckCircle className="w-14 h-14 text-green-500 animate-[bounce_1s_ease-out]" />
                </div>
                {/* Decorative particles */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-100 opacity-80"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-yogya-red rounded-full animate-bounce delay-300 opacity-80"></div>
            </div>
            
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pembayaran Berhasil!</h1>
                <p className="text-gray-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                    Transaksi Anda telah berhasil diproses. Terima kasih telah berbelanja.
                </p>
            </div>

            {/* Order Code Card - Ticket Style */}
            <div className="w-full max-w-xs bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-6 mb-8 relative">
                {/* Cutout Circles for Ticket Effect */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border-r-2 border-gray-200"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full border-l-2 border-gray-200"></div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Kode Pengambilan</span>
                    <div className="text-4xl font-mono font-black text-gray-800 tracking-widest mt-1">
                        {orderNumber}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3 max-w-xs">
                <Button 
                    fullWidth 
                    onClick={onViewReceipt} 
                    size="lg"
                    className="shadow-xl shadow-yogya-red/20 py-4 text-base"
                >
                    <Receipt className="w-5 h-5" /> Lihat & Cetak Struk
                </Button>
                
                <Button 
                    fullWidth 
                    variant="ghost" 
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                >
                    <Mail className="w-5 h-5 mr-2" /> Kirim Struk via Email
                </Button>
            </div>
        </div>
    );
};

// --- RECEIPT SCREEN ---
export const ReceiptScreen: React.FC<{
    cart: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    orderNumber: string;
    onFinish: () => void;
}> = ({ cart, subtotal, tax, total, orderNumber, onFinish }) => {
    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="flex-1 p-5 overflow-y-auto">
                <div className="bg-white shadow-xl rounded-b-xl overflow-hidden relative mt-2">
                    {/* Receipt Jagged Edge Top - CSS Trick */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gray-100" 
                         style={{clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'}}>
                    </div>
                    
                    <div className="p-6 pt-10">
                        <div className="text-center mb-8 pb-6 border-b border-gray-100">
                             {/* UPDATE: Logo diperbesar (h-20) dan margin bawah ditambah (mb-4) */}
                             <div className="flex items-center justify-center gap-2 mb-4">
                                <img 
                                src={YogyaLogo} 
                                alt="Yogya Logo" 
                                className="h-20 w-auto object-contain grayscale opacity-80"
                                />
                            </div>
                            <h2 className="font-bold text-lg text-gray-800">YOGYA Supermarket</h2>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Jl. Sunda No. 60, Bandung</p>
                            
                            <div className="mt-4 text-[10px] text-gray-500 bg-gray-50 py-2 px-3 rounded-lg flex justify-between items-center font-mono">
                                <span>{new Date().toLocaleDateString()}</span>
                                <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm group">
                                    <div className="flex-1 pr-4">
                                        <p className="text-gray-800 font-bold text-xs mb-0.5">{item.name}</p>
                                        <p className="text-gray-400 text-[10px]">
                                            {item.qty} x {item.isWeighted ? `${item.weight}kg @` : ''} {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                    <p className="text-gray-800 font-medium text-xs">
                                        {formatCurrency(item.price * (item.weight || 1) * item.qty)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-900 border-dashed pt-4 space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>PPN (11%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-lg text-gray-900 pt-3 mt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${orderNumber}`} alt="Barcode" className="mx-auto w-20 opacity-40 mix-blend-multiply" />
                            <p className="text-[10px] text-gray-400 mt-2 font-mono">#{orderNumber}</p>
                        </div>
                    </div>
                     {/* Receipt Jagged Edge Bottom */}
                     <div className="h-4 bg-gray-100 w-full" style={{clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)'}}></div>
                </div>
            </div>

            <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
                <Button fullWidth onClick={onFinish} size="lg" className="shadow-xl">Selesai & Ambil Barang</Button>
            </div>
        </div>
    );
};

// --- BAGGING SCREEN ---
export const BaggingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center">
            <div className="w-56 h-56 relative mb-10">
                 <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
                 <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <ShoppingBag className="w-24 h-24 text-gray-300" />
                 </div>
                 <div className="absolute top-0 right-4 p-4 bg-yogya-green rounded-full shadow-xl animate-bounce border-4 border-white">
                    <Check className="w-8 h-8 text-white" />
                 </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Silakan Ambil Barang</h2>
            <p className="text-gray-500 mb-10 max-w-[280px] mx-auto text-sm leading-relaxed">Jangan lupa ambil struk belanja dan pastikan tidak ada barang tertinggal.</p>

            <Button onClick={onComplete} size="lg" className="w-full max-w-xs shadow-xl shadow-yogya-red/20">
                Keluar
            </Button>
        </div>
    );
};

// --- EXIT SCREEN ---
export const ExitScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => {
    useEffect(() => {
        // Auto reset after 5 seconds
        const timer = setTimeout(onReset, 5000);
        return () => clearTimeout(timer);
    }, [onReset]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-yogya-red p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
            
            <div className="z-10 animate-in zoom-in duration-700 flex flex-col items-center">
                 {/* UPDATE: Logo GEDE (h-28) */}
                 <img 
                    src={YogyaLogo} 
                    alt="Yogya Logo" 
                    className="h-28 w-auto object-contain brightness-0 invert opacity-90 mb-8"
                  />
                <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Terima Kasih</h1>
                <p className="text-lg font-medium opacity-90 mb-10">Sampai jumpa kembali!</p>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-20"></div>
            </div>

             <div className="absolute bottom-12 z-10 w-full px-10">
                <Button variant="ghost" className="text-white hover:bg-white/10 w-full border border-white/20" onClick={onReset}>
                    <LogOut className="w-5 h-5 mr-2" /> Kembali ke Awal
                </Button>
             </div>
        </div>
    );
};