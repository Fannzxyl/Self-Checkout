import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Indomie Goreng', price: 3500, image: 'https://yoline.co.id/media/products/ProductIndomie_goreng_special_jumbo_129gr.png', category: 'cpg' },
  { id: '2', name: 'Ultra Milk Coklat 1L', price: 18900, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBk2t41EbtGcKgOgYjz81YIivR_rB0FbZh4A&s', category: 'cpg' },
  { id: '3', name: 'Roti Tawar Kupas', price: 14500, image: 'https://down-id.img.susercontent.com/file/id-11134207-7qukz-lgt7at9bb9dvda', category: 'cpg' },
  { id: '4', name: 'Kecap Manis Bango', price: 24000, image: 'https://image.astronauts.cloud/product-images/2024/10/OCT2_a4345a85-42d0-473d-ab86-ef25a0893cbb_900x900.jpg', category: 'cpg' },
  { id: '5', name: 'Minyak Goreng 2L', price: 38000, image: 'https://c.alfagift.id/product/1/1_A09350001880_20211116135938878_base.jpg', category: 'cpg' },
];

export const WEIGHT_PRODUCTS: Product[] = [
  { id: 'w1', name: 'Apel Fuji', price: 45000, image: 'https://picsum.photos/id/493/200/200', category: 'produce', isWeighted: true },
  { id: 'w2', name: 'Pisang Cavendish', price: 22000, image: 'https://picsum.photos/id/824/200/200', category: 'produce', isWeighted: true },
  { id: 'w3', name: 'Jeruk Medan', price: 35000, image: 'https://picsum.photos/id/1080/200/200', category: 'produce', isWeighted: true },
  { id: 'w4', name: 'Brokoli Segar', price: 28000, image: 'https://picsum.photos/id/604/200/200', category: 'produce', isWeighted: true },
];

export const TAX_RATE = 0.11; // 11% PPN