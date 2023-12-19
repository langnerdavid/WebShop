import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class userDataService {
  role: string | null = null;
  id: string | null = null;
  password: string | null = null;
  cart: string | null = null;
  constructor(private apiService: ApiService) {
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
    this.cart = sessionStorage.getItem("cart");
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
      let conditionMet:boolean = false;
      oldCart = JSON.parse(oldCart);
      for (let i = 0; i<oldCart.articles.length; i++){
        if(oldCart.articles[i].productId === productId){
          oldCart.articles[i].quantity += quantity;
          console.log(oldCart.articles[i].quantity);
          conditionMet = true;
          break;
        }
      }
      if(!conditionMet){
        oldCart.articles.push(newArticle);
      }
      sessionStorage.setItem('cart', JSON.stringify(oldCart));
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

  getCartNumber(){
    if(this.isSignedIn()){
      this.
      return 1;
    }else{
      if (typeof this.cart === "string") {
        let cart = JSON.parse(this.cart);
        let cartNumber = 0;
        for(let i = 0; i<cart.articles.length; i++){
          cartNumber += parseInt(cart.articles.quantity);
        }
        return cartNumber;
      }else{
        return 0;
      }
    }
  }

  isBuyer(){
    return this.role === 'buyer';
  }
}
