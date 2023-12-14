export interface CreateEchoInput {
  message: string;
}

export enum OrderStatus {
  Placed = 'placed',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Canceled = 'canceled',
}

export interface Echo {
  _id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  _id: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  available: string;
  brand: string;
  searchingKeywords: [string];
  createdAt: Date;
  updatedAt: Date;
}
export interface ArticlePost {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  available: string;
  brand: string;
  searchingKeywords: [string];
}
export interface ArticlePatch {
  title?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  available?: string;
  brand?: string;
  searchingKeywords?: [string];
}
export interface Buyer {
  _id: string;
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  zipCode: number,
  city: string,

  createdAt: Date,
  updatedAt: Date
}
export interface BuyerPost {
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  zipCode: number,
  city: string,
}
export interface BuyerPatch {
  password?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  address?: string,
  zipCode?: number,
  city?: string,
}
export interface Cart {
  _id: string;
  articles: [Article],
  buyer: string,
  totalAmount: number,

  createdAt: Date;
  updatedAt: Date;
}
export interface CartPost {
  articles: [Article],
  buyer: string,
  totalAmount: number
}
export interface CartPatch {
  articles?: [Article],
  buyer?: string,
  totalAmount?: number
}

export interface Order {
  _id: string;
  articles: [Article],
  buyer: string,
  totalAmount: number,
  status: OrderStatus,

  createdAt: Date;
}
export interface OrderPost {
  articles: [Article],
  buyer: string,
  totalAmount: number,
  status: OrderStatus
}
export interface Seller {
  _id: string;
  password: string,
  email: string,
  brand: string,
  address: string,
  zipCode: number,
  city: string,
  createdAt: Date;
  updatedAt: Date;
}
export interface SellerPost {
  password: string,
  email: string,
  brand: string,
  address: string,
  zipCode: number,
  city: string,
}
