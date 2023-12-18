import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class userDataService {
  role: string | null = null;
  id: string | null = null;
  password: string | null = null;
  cart: string | null = null;
  constructor() {
    this.role = localStorage.getItem("role") ?? sessionStorage.getItem("role");
    this.id = localStorage.getItem("id") ?? sessionStorage.getItem("id");
    this.password = localStorage.getItem("password") ?? sessionStorage.getItem("password");
    this.cart = sessionStorage.getItem("cart");
  }
  isSignedIn(): boolean {
    return !(this.role === null || this.id === null || this.password === null);
  }

  updateData(){
    this.role = localStorage.getItem("role") ?? sessionStorage.getItem("role");
    this.id = localStorage.getItem("id") ?? sessionStorage.getItem("id");
    this.password = localStorage.getItem("password") ?? sessionStorage.getItem("password");
    this.cart = localStorage.getItem("cart");
    //TODO Update header
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

  setCartNotSignedIn(productId:string, quantity:number){
    let newArticle = {
      productId: productId,
      quantity: quantity
    }
    let oldCart:any = sessionStorage.getItem('cart');
    if(oldCart){
      oldCart = JSON.parse(oldCart);
      oldCart.articles.push(newArticle);
    }else{
      let cart ={
        articles:[
          {
            productId: productId,
            quantity: quantity
          }
        ]
      }
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  getCart(){
    if(this.isSignedIn()){
      //TODO cart für signed In User
      return
    }else{
      let cart:any = sessionStorage.getItem('cart');
      if(cart){
        return JSON.parse(cart);
      }else{
        return false;
      }
    }
  }

  isBuyer(){
    return this.role === 'buyer';
  }
}
