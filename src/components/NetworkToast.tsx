import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';

export const NetworkToast: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShow(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Kasih delay dikit buat ngasih tau "Connected" sebelum ilang (opsional), 
      // tapi biar bersih kita langsung hide aja setelah beberapa detik konek
      setTimeout(() => setShow(false), 2000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !show) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out transform ${
        isOffline ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700 min-w-[280px]">
        <div className="bg-red-500 p-1.5 rounded-full animate-pulse">
            <WifiOff className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-bold">Koneksi Terputus</span>
            <span className="text-xs text-gray-300">Memeriksa jaringan...</span>
        </div>
      </div>
    </div>
  );
};