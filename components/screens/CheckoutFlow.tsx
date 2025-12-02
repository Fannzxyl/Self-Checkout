import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, QrCode, ArrowLeft, CheckCircle, Receipt, Mail, ShoppingBag, LogOut, Check } from 'lucide-react';
import { Button } from '../Shared';
import { formatCurrency, CartItem, PaymentMethod } from '../../types';

// --- PAYMENT METHOD SCREEN ---
export const PaymentMethodScreen: React.FC<{
  total: number;
  onSelectMethod: (method: PaymentMethod) => void;
  onBack: () => void;
}> = ({ total, onSelectMethod, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white p-4 flex items-center gap-4 border-b border-gray-200">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Pembayaran</h2>
        </div>

        <div className="p-6">
            <div className="text-center mb-8 mt-4">
                <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
                <h1 className="text-4xl font-extrabold text-yogya-red">{formatCurrency(total)}</h1>
            </div>

            <h3 className="font-bold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>
            
            <div className="space-y-3">
                <button 
                    onClick={() => onSelectMethod('QRIS')}
                    className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-yogya-green hover:shadow-md transition-all flex items-center gap-4 group"
                >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-yogya-green group-hover:text-white transition-colors">
                        <QrCode className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-800">QRIS</p>
                        <p className="text-xs text-gray-500">Scan QR Code (GoPay, OVO, Dana)</p>
                    </div>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded group-hover:bg-yogya-green group-hover:text-white transition-colors">PROMO</div>
                </button>

                <button 
                    onClick={() => onSelectMethod('CARD')}
                    className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-yogya-red hover:shadow-md transition-all flex items-center gap-4 group"
                >
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-yogya-red group-hover:text-white transition-colors">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-800">Kartu Debit / Kredit</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, GPN</p>
                    </div>
                </button>

                <button 
                    onClick={() => onSelectMethod('CASH')}
                    className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-yogya-yellow hover:shadow-md transition-all flex items-center gap-4 group"
                >
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-yogya-yellow group-hover:text-white transition-colors">
                        <Banknote className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-800">Tunai</p>
                        <p className="text-xs text-gray-500">Bayar di mesin tunai</p>
                    </div>
                </button>
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
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                 <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="font-bold text-gray-900">Pembayaran QRIS</h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200 mb-8 relative">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YOGYA-PAY-${total}`} alt="QR Code" className="w-48 h-48" />
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yogya-red text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                        {formatCurrency(total)}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Scan untuk Membayar</h3>
                <p className="text-gray-500 text-sm mb-8">Dukungan: GoPay, OVO, Dana, LinkAja, Mobile Banking</p>

                <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Menunggu Pembayaran</span>
                        <span className="text-sm font-mono font-bold text-yogya-red">00:{countdown.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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

// --- SUCCESS SCREEN ---
export const SuccessScreen: React.FC<{
    orderNumber: string;
    onViewReceipt: () => void;
}> = ({ orderNumber, onViewReceipt }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-[bounce_1s_ease-out]">
                <CheckCircle className="w-12 h-12 text-yogya-green" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-gray-500 mb-8">Terima kasih telah berbelanja.</p>

            <div className="bg-gray-50 w-full rounded-xl p-4 border border-gray-100 mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-xl font-mono font-bold text-gray-800 tracking-widest">{orderNumber}</p>
            </div>

            <div className="w-full space-y-3">
                <Button fullWidth onClick={onViewReceipt} className="flex items-center justify-center gap-2">
                    <Receipt className="w-5 h-5" /> Cetak Struk
                </Button>
                <Button fullWidth variant="outline" className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" /> Kirim via Email
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
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="bg-white shadow-lg rounded-none sm:rounded-lg overflow-hidden relative">
                    {/* Receipt Jagged Edge Top */}
                    <div className="h-2 bg-gray-800 w-full"></div>
                    
                    <div className="p-6">
                        <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-6">
                            <h2 className="font-bold text-xl text-gray-900 tracking-tight">YOGYA<span className="font-light">Center</span></h2>
                            <p className="text-xs text-gray-500 mt-1">Jl. Sunda No. 60, Bandung</p>
                            <p className="text-xs text-gray-500">Telp: (022) 420-5555</p>
                            <div className="mt-4 text-xs text-gray-400 flex justify-between">
                                <span>{new Date().toLocaleDateString()}</span>
                                <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Order: #{orderNumber}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium">{item.name}</p>
                                        <p className="text-gray-400 text-xs">
                                            {item.qty} x {item.isWeighted ? `${item.weight}kg @` : ''} {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                    <p className="text-gray-800 font-medium">
                                        {formatCurrency(item.price * (item.weight || 1) * item.qty)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>PPN (11%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 mt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${orderNumber}`} alt="Barcode" className="mx-auto w-24 opacity-80" />
                            <p className="text-xs text-gray-400 mt-2">Terima kasih telah berbelanja</p>
                        </div>
                    </div>
                     {/* Receipt Jagged Edge Bottom */}
                     <div className="h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMEgwWiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-contain bg-bottom bg-repeat-x"></div>
                </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
                <Button fullWidth onClick={onFinish}>Ambil Barang</Button>
            </div>
        </div>
    );
};

// --- BAGGING SCREEN ---
export const BaggingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center">
            <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
                 <ShoppingBag className="w-20 h-20 text-gray-400" />
                 <div className="absolute top-0 right-0 p-3 bg-yogya-green rounded-full shadow-lg animate-bounce">
                    <Check className="w-6 h-6 text-white" />
                 </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Silakan Ambil Barang Anda</h2>
            <p className="text-gray-500 mb-8 max-w-[250px] mx-auto">Pastikan semua barang belanjaan dan struk sudah diambil.</p>

            <Button onClick={onComplete} size="lg" className="px-12">
                Selesai & Keluar
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
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="z-10 animate-in zoom-in duration-500">
                <h1 className="text-4xl font-extrabold mb-4">Terima Kasih</h1>
                <p className="text-xl font-light opacity-90 mb-8">Telah berbelanja di YOGYA Center</p>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-8"></div>
                <p className="text-sm opacity-70">Sampai jumpa kembali!</p>
            </div>

             <div className="absolute bottom-12 z-10">
                <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onReset}>
                    <LogOut className="w-5 h-5 mr-2" /> Kembali ke Awal
                </Button>
             </div>
        </div>
    );
};