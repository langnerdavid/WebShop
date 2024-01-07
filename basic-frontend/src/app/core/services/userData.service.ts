import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class userDataService {
  private cartNumberSubject = new Subject<number>();

  cartNumber$ = this.cartNumberSubject.asObservable();

  role: string | null = null;
  id: string | null = null;
  password: string | null = null;
  cart: string | null = null;
  shoppingCartNumber$ = 0;
  constructor(private apiService: ApiService) {
    this.setStorageDetail();
  }
  isSignedIn(): boolean {
    return !(this.role === null || this.id === null || this.password === null);
  }

  updateData(){
    this.setStorageDetail();
  }

  deleteAll(){
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("password");

    sessionStorage.removeItem("role");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("cart");
  }

  setFullCartNotSignedIn(cart:{articles:{productId:string, quantity: number}[]}){
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }
  setCartNotSignedIn(productId:string, quantity:number, inCart: boolean){
    const newArticle = {
      productId: productId,
      quantity: quantity
    }
    let oldCart:any = sessionStorage.getItem('cart');
    if(oldCart){
      let conditionMet = false;
      oldCart = JSON.parse(oldCart);
      for (let i = 0; i<oldCart.articles.length; i++){
        if(oldCart.articles[i].productId === productId){
          if(inCart){
            oldCart.articles[i].quantity = quantity;
          }else{
            oldCart.articles[i].quantity += quantity;
          }
          conditionMet = true;
          break;
        }
      }
      if(!conditionMet){
        oldCart.articles.push(newArticle);
      }
      sessionStorage.setItem('cart', JSON.stringify(oldCart));
    }else {
      const cart = {
        articles: [
          {
            productId: productId,
            quantity: quantity
          }
        ]
      }
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
    this.cart = sessionStorage.getItem('cart');
    this.updateCartNumberTest();
  }

  updateCartNumberTest(): void{
    if (this.isSignedIn()) {
      this.apiService.getOneCart(this.id).then((data: any) => {
        if (!data.error) {
          let cartNumber = 0;
          for (let i = 0; i < data.articles.length; i++) {
            cartNumber += data.articles[i].quantity;
          }
          this.updateCartNumber(cartNumber);
          return
        }
      }).catch(() => {
        this.updateCartNumber(0);
        // Optionally, you can handle the error here if needed.
      });
    } else {
      if (typeof this.cart === "string") {
        this.updateData();
        const cartReq = JSON.parse(this.cart);
        let cartNumber = 0;
        for (let i = 0; i < cartReq.articles.length; i++) {
          cartNumber += cartReq.articles[i].quantity;
        }
        this.updateCartNumber(cartNumber);
        return;
      } else {
        this.updateCartNumber(0);
        return;
      }
    }
  }

  updateCartNumber(cartNumber: number) {
    console.log('cartNumber update: ', cartNumber);
    this.cartNumberSubject.next(cartNumber);
  }


  isBuyer(){
    return this.role === 'buyer';
  }
  isSeller(){
    return this.role === 'seller';
  }

  deleteCartNotSignedIn(){
    sessionStorage.removeItem('cart');
    this.cart = null;
  }

  setStorageDetail(){
    this.role = localStorage.getItem("role") ?? sessionStorage.getItem("role");
    this.id = localStorage.getItem("id") ?? sessionStorage.getItem("id");
    this.password = localStorage.getItem("password") ?? sessionStorage.getItem("password");
    this.cart = sessionStorage.getItem("cart");
  }
}
