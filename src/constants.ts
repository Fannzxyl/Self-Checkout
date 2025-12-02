import { Product } from './src/types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Indomie Goreng', price: 3500, image: 'https://picsum.photos/id/292/200/200', category: 'cpg' },
  { id: '2', name: 'Ultra Milk Coklat 1L', price: 18900, image: 'https://picsum.photos/id/225/200/200', category: 'cpg' },
  { id: '3', name: 'Roti Tawar Kupas', price: 14500, image: 'https://picsum.photos/id/431/200/200', category: 'cpg' },
  { id: '4', name: 'Kecap Manis Bango', price: 24000, image: 'https://picsum.photos/id/63/200/200', category: 'cpg' },
  { id: '5', name: 'Minyak Goreng 2L', price: 38000, image: 'https://picsum.photos/id/75/200/200', category: 'cpg' },
];

export const WEIGHT_PRODUCTS: Product[] = [
  { id: 'w1', name: 'Apel Fuji', price: 45000, image: 'https://picsum.photos/id/493/200/200', category: 'produce', isWeighted: true },
  { id: 'w2', name: 'Pisang Cavendish', price: 22000, image: 'https://picsum.photos/id/824/200/200', category: 'produce', isWeighted: true },
  { id: 'w3', name: 'Jeruk Medan', price: 35000, image: 'https://picsum.photos/id/1080/200/200', category: 'produce', isWeighted: true },
  { id: 'w4', name: 'Brokoli Segar', price: 28000, image: 'https://picsum.photos/id/604/200/200', category: 'produce', isWeighted: true },
];

export const TAX_RATE = 0.11; // 11% PPN