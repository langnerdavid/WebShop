import { Component } from '@angular/core';
import {userDataService} from "../../core/services/userData.service";
import {Cart} from "../../core/types/echo.type";
import {ApiService} from "../../core/services/api.service";


@Component({
  selector: 'app-cart',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent {
  isCartEmpty:boolean = true;
  cartItems:{id: number, name: string, price: number, quantity: number, total:number}[] = [
  ];
  cart: Cart|undefined;

  totalAmount: number | undefined;
  constructor(private userDataService: userDataService, private apiService:ApiService) {
  }
  ngOnInit(){
    if(this.userDataService.isSignedIn()){

    }else{
      this.cart = JSON.parse(<string>this.userDataService.cart);
      console.log(this.cart);
      if(this.cart){
        this.isCartEmpty = false;
        for(let i = 0; <number>this.cart?.articles.length > i; i++){
          this.apiService.getOneArticle(this.cart.articles[i].productId).then((data:any) => {
            console.log(data)
            if(data){
              let article = {
                id: i,
                name: data.title,
                price: data.price,
                quantity: this.cart?.articles[i].quantity ?? 1,
                total: this.calculateTotalArticle(data.price, this.cart?.articles[i].quantity ?? 1)
              };
              this.cartItems.push(article);
            }
            if (i === <number>this.cart?.articles.length - 1) {
              this.calculateTotal();
            }
          });
        }
      }
    }
  }

  calculateTotal() {
    console.log(this.cartItems);
    this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    console.log(this.totalAmount);
  }
  calculateTotalArticle(price: number, quantity: number): number {
    const total = price * quantity;
    return Math.round(total * 100) / 100;
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.calculateTotal();
  }
}
