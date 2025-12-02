export enum ScreenName {
  WELCOME = 'WELCOME',
  SCAN = 'SCAN',
  WEIGHT = 'WEIGHT',
  CART = 'CART',
  PAYMENT_METHODS = 'PAYMENT_METHODS',
  QRIS = 'QRIS',
  CARD_PAYMENT = 'CARD_PAYMENT',
  SUCCESS = 'SUCCESS',
  RECEIPT = 'RECEIPT',
  BAGGING = 'BAGGING',
  EXIT = 'EXIT'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: 'produce' | 'cpg';
  isWeighted?: boolean;
}

export interface CartItem extends Product {
  qty: number;
  weight?: number; // in kg
}

export type PaymentMethod = 'QRIS' | 'CARD' | 'CASH';

export interface AppState {
  currentScreen: ScreenName;
  cart: CartItem[];
  isStaffAssistanceRequested: boolean;
  orderNumber: string;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};