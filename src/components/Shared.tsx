import React from 'react';
import { HelpCircle, AlertTriangle, X, ShoppingBag } from 'lucide-react';
import { ScreenName } from '../types';

// --- IMPORT DARI ASSETS ---
// Mundur 1 langkah (..) dari folder 'components' ke 'src', lalu masuk 'assets'
import logoYogya from '../assets/Yogya_Group.png';

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
  const baseStyles = "rounded-lg font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-yogya-red text-white hover:bg-red-700 shadow-lg shadow-red-900/20",
    secondary: "bg-yogya-green text-white hover:bg-teal-700 shadow-lg shadow-teal-900/20",
    danger: "bg-gray-800 text-white hover:bg-gray-900 border border-gray-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- STAFF ASSISTANCE MODAL ---
interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-[90%] rounded-2xl p-6 shadow-2xl border-l-4 border-yogya-yellow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yogya-yellow/10 rounded-full">
              <AlertTriangle className="w-8 h-8 text-yogya-yellow" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bantuan Staf</h2>
              <p className="text-sm text-gray-500">Staf kami sedang menuju ke lokasi Anda.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm font-medium text-gray-700">Mohon tunggu sebentar...</p>
            <p className="text-xs text-gray-500 mt-1">Lampu indikator di atas mesin telah menyala merah.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <div className="text-xs p-2 rounded bg-red-50 text-red-700 border border-red-100">Gagal Scan</div>
             <div className="text-xs p-2 rounded bg-yellow-50 text-yellow-700 border border-yellow-100">Verifikasi Usia</div>
             <div className="text-xs p-2 rounded bg-blue-50 text-blue-700 border border-blue-100">Beda Berat</div>
             <div className="text-xs p-2 rounded bg-green-50 text-green-700 border border-green-100">Pembayaran</div>
          </div>
        </div>

        <Button fullWidth onClick={onClose} variant="outline">
          Batalkan Panggilan
        </Button>
      </div>
    </div>
  );
};

// --- LAYOUT ---
interface LayoutProps {
  children: React.ReactNode;
  onRequestAssistance: () => void;
  screenName: ScreenName;
  cartCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, onRequestAssistance, screenName, cartCount }) => {
  const isHomeScreen = screenName === ScreenName.WELCOME;
  const isExitScreen = screenName === ScreenName.EXIT;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] aspect-[9/16] bg-white rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col border-8 border-gray-900">
        
        {!isHomeScreen && !isExitScreen && (
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
            
            {/* --- LOGO + TEKS (DIPERBAIKI) --- */}
            <div className="flex items-center gap-2">
                {/* Gambar Logo */}
                <img 
                    src={logoYogya} 
                    alt="Yogya Group" 
                    className="h-9 w-auto object-contain" 
                />
                
                {/* Teks Nama Toko */}
                <div className="flex flex-col justify-center">
                    <span className="font-bold text-gray-800 text-sm leading-none">YOGYA</span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide">Supermarket</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                {cartCount > 0 && screenName !== ScreenName.RECEIPT && screenName !== ScreenName.SUCCESS && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
                        <ShoppingBag className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-bold text-gray-900">{cartCount}</span>
                    </div>
                )}
                <button 
                  onClick={onRequestAssistance}
                  className="flex items-center gap-1.5 text-yogya-red font-semibold text-sm bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Bantuan</span>
                </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-yogya-light">
            {children}
        </main>

        {isHomeScreen && (
             <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-gray-400 text-xs">v2.5.0 • Yogya Group Retail System</p>
             </div>
        )}
      </div>
    </div>
  );
};