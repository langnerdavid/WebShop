export interface CreateEchoInput {
  message: string;
}

export type OrderStatus = "placed" | "payed" | "shipped" | "canceled" | "delivered";

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
  visible: boolean;
  brand: string;
  searchingKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface ArticlePost {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  visible: boolean;
  brand: string;
  searchingKeywords: string[];
}
export interface ArticlePatch {
  title?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  visible?: boolean;
  brand?: string;
  searchingKeywords?: string[];
}
export interface Buyer {
  _id: string;
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  iban: string,
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
  iban: string,
  address: string,
  zipCode: number,
  city: string,
}
export interface BuyerPatch {
  password?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  iban?: string,
  address?: string,
  zipCode?: number,
  city?: string,
}
export interface UserLogin {
  password: string,
  email: string
}
export interface Cart {
  _id: string;
  articles: {productId:string, quantity:number}[],
  buyer: string,
  totalAmount: number,

  createdAt: Date;
  updatedAt: Date;
}
export interface CartPost {
  articles: {productId:string, quantity:number}[]
}
export interface CartPatch {
  articles?: {productId:string, quantity:number}[],
  buyer?: string,
  totalAmount?: number
}

export interface Order {
  _id: string;
  articles: {productId:string, quantity:number}[],
  buyer: string,
  totalAmount: number,
  status: OrderStatus,

  orderDate: string;
}
export interface OrderPost {
  articles: {productId:string, quantity:number}[],
  status: OrderStatus
}
export interface Seller {
  _id: string;
  password: string,
  email: string,
  brand: string,
  iban: string,
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
  iban: string,
  address: string,
  zipCode: number,
  city: string,
}
export interface SellerPatch {
  password?: string,
  email?: string,
  brand?: string,
  iban?: string,
  address?: string,
  zipCode?: number,
  city?: string,
}
