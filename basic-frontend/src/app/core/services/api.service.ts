import {Injectable} from '@angular/core';
import {
  Article,
  ArticlePatch,
  ArticlePost,
  Buyer,
  BuyerPost, CartPost,
  Order,
  OrderPost, OrderStatus,
  SellerPost,
  UserLogin
} from "../types/echo.type";
import {
  getDeleteHeader,
  getPatchHeader,
  getPostHeader,
  getPostHeaderAuthorized,
  handleResponse
} from "../../shared/shared.code";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly ARTICLE_URL = 'http://localhost:3000/api/article';
  private readonly BUYER_URL = 'http://localhost:3000/api/buyer';
  private readonly CART_URL = 'http://localhost:3000/api/cart';
  private readonly ORDER_URL = 'http://localhost:3000/api/order';
  private readonly SELLER_URL = 'http://localhost:3000/api/seller';


  ////////////////////////////////////////// ALL ARTICLE API-REQUESTS /////////////////////////////////////////////////////////
  async getAllArticles(): Promise<Article[]> {
    const response = await fetch(`${this.ARTICLE_URL}`);
    return response.json();
  }

  async getOneArticle(articleId: string): Promise<string> {
    const response = await fetch(`${this.ARTICLE_URL}/${articleId}`);
    return handleResponse(response);
  }

  async postArticle(sellerId: string, password: string, article: { article: ArticlePost }): Promise<string> {
    const options: RequestInit = getPostHeaderAuthorized(sellerId, password);
    options.body = JSON.stringify(article);

    const response = await fetch(`${this.ARTICLE_URL}`, options);
    return handleResponse(response);
  }

  async patchArticle(articleId: string, sellerId: string, password: string, article: { article: ArticlePatch }): Promise<string> {
    const options: RequestInit = getPatchHeader(sellerId, password);
    options.body = JSON.stringify(article);

    const response = await fetch(`${this.ARTICLE_URL}/${articleId}`, options);
    return handleResponse(response);
  }

  async deleteArticle(articleId: string, sellerId: string, password: string): Promise<string> {
    const options: RequestInit = getDeleteHeader(sellerId, password);

    const response = await fetch(`${this.ARTICLE_URL}/${articleId}`, options);
    return handleResponse(response);
  }

  ////////////////////////////////////////// ALL BUYER API-REQUESTS /////////////////////////////////////////////////////////

  async getOneBuyer(buyerId: string): Promise<string> {
    const response = await fetch(`${this.BUYER_URL}/${buyerId}`);
    return handleResponse(response);
  }

  async postBuyer(buyer: { user: BuyerPost }): Promise<string> {
    const options: RequestInit = getPostHeader();
    options.body = JSON.stringify(buyer);

    const response = await fetch(`${this.BUYER_URL}`, options);
    return handleResponse(response);
  }

  async loginBuyer(user: { user: UserLogin }): Promise<any> {
    const options: RequestInit = getPostHeaderAuthorized(user.user.email, user.user.password);
    const response = await fetch(`${this.BUYER_URL}/login`, options);
    return handleResponse(response);
  }

  async patchBuyer(buyerId: string, password: string, user: { user: Buyer }): Promise<string> {
    const options: RequestInit = getPatchHeader(buyerId, password);
    options.body = JSON.stringify(user);

    const response = await fetch(`${this.BUYER_URL}/${buyerId}`, options);
    return handleResponse(response);
  }

  async deleteBuyer(buyerId: string, password: string): Promise<Response> {
    const options: RequestInit = getDeleteHeader(buyerId, password);

    return await fetch(`${this.BUYER_URL}/${buyerId}`, options);
  }

  ////////////////////////////////////////// ALL CART API-REQUESTS /////////////////////////////////////////////////////////
  async getOneCart(buyerId: string | null): Promise<string> {
    const response = await fetch(`${this.CART_URL}/${buyerId}`);
    return handleResponse(response);
  }

  async postCart(buyerId: string, password: string, cart: { cart: CartPost }): Promise<string> {
    const options: RequestInit = getPostHeaderAuthorized(buyerId, password);
    options.body = JSON.stringify(cart);

    const response = await fetch(`${this.CART_URL}`, options);
    return handleResponse(response);
  }

  async patchCart(buyerId: string, password: string, cart: { cart: CartPost }): Promise<string> {
    const options: RequestInit = getPatchHeader(buyerId, password);
    options.body = JSON.stringify(cart);

    const response = await fetch(`${this.CART_URL}/${buyerId}`, options);
    return handleResponse(response);
  }

  async deleteCart(buyerId: string, password: string): Promise<string> {
    const options: RequestInit = getDeleteHeader(buyerId, password);

    const response = await fetch(`${this.CART_URL}/${buyerId}`, options);
    return handleResponse(response);
  }

  ////////////////////////////////////////// ALL ORDER API-REQUESTS /////////////////////////////////////////////////////////
  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${this.ORDER_URL}`);
    return response.json();
  }

  async getOneOrder(orderId: string): Promise<Order[]> {
    const response = await fetch(`${this.ORDER_URL}/${orderId}`);
    return response.json();
  }

  async postOrder(buyerId: string, password: string, order: { order: OrderPost }): Promise<string> {
    const options: RequestInit = getPostHeaderAuthorized(buyerId, password);
    options.body = JSON.stringify(order);

    const response = await fetch(`${this.ORDER_URL}`, options);
    return handleResponse(response);
  }

  async patchOrder(orderId: string, sellerId: string, password: string, order: { order: { status: OrderStatus } }): Promise<string> {
    const options: RequestInit = getPatchHeader(sellerId, password);
    options.body = JSON.stringify(order);

    const response = await fetch(`${this.ORDER_URL}/${orderId}`, options);
    return handleResponse(response);
  }

  ////////////////////////////////////////// ALL SELLER API-REQUESTS /////////////////////////////////////////////////////////

  async getOneSeller(sellerId: string): Promise<string> {
    const response = await fetch(`${this.SELLER_URL}/${sellerId}`);
    return handleResponse(response);
  }

  async postSeller(seller: { user: SellerPost }): Promise<string> {
    const options: RequestInit = getPostHeader();
    options.body = JSON.stringify(seller);

    const response = await fetch(`${this.SELLER_URL}`, options);
    return handleResponse(response);
  }

  async loginSeller(user: { user: UserLogin }): Promise<string> {
    const options: RequestInit = getPostHeaderAuthorized(user.user.email, user.user.password);
    const response = await fetch(`${this.SELLER_URL}/login`, options);
    return handleResponse(response);
  }

  async patchSeller(sellerId: string, password: string, seller: { user: object }): Promise<string> {
    const options: RequestInit = getPatchHeader(sellerId, password);

    options.body = JSON.stringify(seller);

    const response = await fetch(`${this.SELLER_URL}/${sellerId}`, options);
    return handleResponse(response);
  }

  async deleteSeller(sellerId: string, password: string): Promise<Response> {
    const options: RequestInit = getDeleteHeader(sellerId, password);

    return await fetch(`${this.SELLER_URL}/${sellerId}`, options);
  }
}
