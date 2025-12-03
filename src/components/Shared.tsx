// src/components/Shared.tsx
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  ShoppingBag, 
  HelpCircle, 
  ScanLine, 
  User, 
  CreditCard 
} from 'lucide-react';
import logoYogya from '../assets/Yogya_Group.png';
import { ScreenName } from '../types';

// --- BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const base = "rounded-2xl font-extrabold transition-all duration-150 active:scale-98 inline-flex items-center justify-center gap-2";
  const variants: Record<string, string> = {
    primary: "bg-yogya-red text-white hover:bg-red-700 shadow-xl",
    secondary: "bg-yogya-green text-white hover:bg-teal-700 shadow-md",
    danger: "bg-gray-800 text-white hover:bg-gray-900",
    outline: "border-2 border-gray-200 text-gray-700 bg-white hover:border-yogya-red",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- STAFF MODAL (VERSI BARU / PROFESIONAL) ---
interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose }) => {
  // State untuk logika modal (Pilih -> Tunggu)
  const [step, setStep] = useState<'SELECT' | 'WAITING'>('SELECT');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // Reset state setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStep('SELECT');
      setSelectedReason(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCallStaff = () => {
    if (selectedReason) {
      setStep('WAITING');
    }
  };

  const handleCancelCall = () => {
    setStep('SELECT');
    setSelectedReason(null);
    // Opsional: onClose() jika ingin langsung tutup modal saat batal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 'SELECT' ? 'Butuh Bantuan?' : 'Mohon Tunggu'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT: STEP 1 - PILIH MASALAH */}
        {step === 'SELECT' && (
          <>
            <div className="px-6 py-2">
              <p className="text-sm text-gray-500">Silakan pilih kendala yang Anda alami:</p>
            </div>

            <div className="p-6 grid grid-cols-2 gap-3">
              {[
                { id: 'SCAN', label: 'Gagal Scan', icon: ScanLine },
                { id: 'HELP', label: 'Perlu Bantuan', icon: User },
                { id: 'PAY', label: 'Masalah Bayar', icon: CreditCard },
                { id: 'OTHER', label: 'Kendala Lain', icon: HelpCircle },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedReason(item.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group active:scale-[0.98] ${
                    selectedReason === item.id 
                      ? 'border-yogya-red bg-red-50' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <item.icon className={`w-8 h-8 mb-3 transition-colors ${
                    selectedReason === item.id ? 'text-yogya-red' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-bold ${
                    selectedReason === item.id ? 'text-yogya-red' : 'text-gray-600'
                  }`}>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={handleCallStaff}
                disabled={!selectedReason}
                className="w-full py-4 rounded-xl bg-yogya-red text-white font-bold shadow-lg shadow-red-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Panggil Staf
              </button>
            </div>
          </>
        )}

        {/* CONTENT: STEP 2 - MENUNGGU STAF */}
        {step === 'WAITING' && (
          <>
            <div className="px-6 py-4">
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm animate-bounce">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Bantuan Sedang Diproses</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Lampu indikator di atas mesin telah menyala merah. Staf kami sedang menuju ke lokasi Anda.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-2">
              <button 
                onClick={handleCancelCall}
                className="w-full py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all"
              >
                Batalkan Panggilan
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

// --- LAYOUT COMPONENT ---
interface LayoutProps {
  children: React.ReactNode;
  onRequestAssistance: () => void;
  screenName: ScreenName;
  cartCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, onRequestAssistance, screenName, cartCount }) => {
  const isHome = screenName === ScreenName.WELCOME;
  const isExit = screenName === ScreenName.EXIT;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] aspect-[9/16] bg-white rounded-[1.75rem] shadow-2xl overflow-hidden relative flex flex-col border-[12px] border-gray-900">
        {!isHome && !isExit && (
          <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <img src={logoYogya} alt="Yogya" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-extrabold text-yogya-red text-lg leading-none">YOGYA</span>
                <span className="text-[12px] text-gray-500 font-bold tracking-widest uppercase">Supermarket</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {cartCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
                  <ShoppingBag className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-bold text-gray-900">{cartCount}</span>
                </div>
              )}
              
              {/* TOMBOL BANTUAN DIKEMBALIKAN KE SINI */}
              <button
                onClick={onRequestAssistance}
                className="flex items-center gap-2 text-yogya-red font-semibold text-sm bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Bantuan</span>
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto relative bg-yogya-light">
          {children}
        </main>

        {isHome && (
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-gray-400 text-xs">v2.5.0 • Yogya Group Retail System</p>
          </div>
        )}
      </div>
    </div>
  );
};