import React from 'react';
import { PackagePlus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface SimulationPanelProps {
  onScan: (product: Product) => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ onScan }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div className="flex items-center gap-2 mb-3 text-gray-500">
        <PackagePlus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Simulasi Scan Barang</span>
      </div>
      
      {/* Container Scroll ke samping biar muat banyak */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {MOCK_PRODUCTS.map((product) => (
          <button
            key={product.id}
            onClick={() => onScan(product)}
            className="flex-shrink-0 w-20 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 p-1 group-hover:border-yogya-red transition-colors shadow-sm relative overflow-hidden">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                />
                {/* Efek kilat pas di hover */}
                <div className="absolute inset-0 bg-yogya-red/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-[10px] text-center font-medium text-gray-600 line-clamp-2 leading-tight group-hover:text-yogya-red">
                {product.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};