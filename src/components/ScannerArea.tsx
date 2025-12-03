import React from 'react';
import { ScanLine, Touchpad } from 'lucide-react';

interface ScannerAreaProps {
  onClick: () => void;
}

export const ScannerArea: React.FC<ScannerAreaProps> = ({ onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="w-full h-64 relative rounded-2xl overflow-hidden bg-black shadow-inner border border-gray-800 mx-auto my-4 group cursor-pointer active:scale-[0.98] transition-transform duration-100"
    >
      {/* Background Camera (Simulasi Gelap) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-50"></div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Frame Pojokan (Corner Brackets) */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-yogya-red rounded-tl-lg"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-yogya-red rounded-tr-lg"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-yogya-red rounded-bl-lg"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-yogya-red rounded-br-lg"></div>

      {/* Animasi Laser Scan */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

      {/* Teks Instruksi */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex flex-col items-center">
            <ScanLine className="w-10 h-10 mb-2 opacity-80" />
            <p className="text-sm font-medium tracking-wide">Tap Layar untuk Scan</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full border border-green-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                Scanner Aktif
            </div>
        </div>
      </div>
    </div>
  );
};