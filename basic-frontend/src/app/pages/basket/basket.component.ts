import { Component } from '@angular/core';
import {userDataService} from "../../core/services/userData.service";
import {Cart} from "../../core/types/echo.type";
import {ApiService} from "../../core/services/api.service";
import {updateCart, updateFullCart} from "../../shared/shared.code";


@Component({
  selector: 'app-cart',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent {
  isCartEmpty:boolean = true;
  cartItems:{id: number, productId:string, name: string, price: number, quantity: number, total:number}[] = [
  ];
  cart: Cart|undefined;

  totalAmount: number | undefined;
  constructor(private userDataService: userDataService, private apiService:ApiService) {
  }
  ngOnInit(){
    if(this.userDataService.isSignedIn()){
      this.apiService.getOneCart(this.userDataService.id).then((data:any)=>{
        if(!data.error){
          this.cart = data;
          if(this.cart && this.cart?.articles.length !== 0){
            console.log(this.cart);
            this.isCartEmpty = false;
            for(let i = 0; <number>this.cart.articles.length > i; i++){
              this.apiService.getOneArticle(this.cart.articles[i].productId).then((data:any) => {
                if(data){
                  let article = {
                    id: i,
                    productId: data._id,
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
          }else{
            this.isCartEmpty = true;
          }
        }else{
          console.log('test');
          //TODO error
        }
      })

    }else{
      this.cart = JSON.parse(<string>this.userDataService.cart);
      if(this.cart){
        this.isCartEmpty = false;
        for(let i = 0; <number>this.cart?.articles.length > i; i++){
          this.apiService.getOneArticle(this.cart.articles[i].productId).then((data:any) => {
            if(data){
              let article = {
                id: i,
                productId: data._id,
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
    const rawTotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.totalAmount = parseFloat(rawTotal.toFixed(2));
  }
  calculateTotalArticle(price: number, quantity: number): number {
    const total = price * quantity;
    return Math.round(total * 100) / 100;
  }

  removeFromCart(itemId: number) {
    if (this.userDataService.isSignedIn()) {
      this.apiService.getOneCart(this.userDataService.id).then((data: any) => {
        if (!data.error) {
          let newCart: { articles: { productId: string; quantity: number }[] } = { articles: data.articles };

          // Log the initial state of newCart.articles and the itemId to be removed

          // Use filter to remove the item with the specified itemId
          newCart.articles = newCart.articles.filter((item, index) => index !== itemId);
          console.log(newCart)
          // Call the patchCart API to update the cart
          this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, { cart: newCart })
            .then((patchData: any) => {
              console.log(patchData);
              this.cartItems = this.cartItems.filter(item => item.id !== itemId);
              if (this.cartItems.length === 0) {
                this.isCartEmpty = true;
              }
              this.userDataService.updateCartNumberTest();
              this.calculateTotal();
            })
            .catch((patchError: any) => {
              console.error('Error patching cart:', patchError);
            });
        }
      });
    } else {
      console.log(this.cartItems);
      console.log(itemId);
      let newCart = JSON.parse(<string>this.userDataService.cart);
      newCart.articles = newCart.articles.filter((item: {
        productId: string,
        quantity: number
      }) => item.productId !== this.cartItems[itemId].productId);
      this.userDataService.setFullCartNotSignedIn(newCart);
    }

    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    if (this.cartItems.length === 0) {
      this.isCartEmpty = true;
    }
    this.userDataService.updateCartNumberTest();
    this.calculateTotal();
  }

  onQuantityChange(quantity:number, itemId: number){
    this.calculateTotal();
    this.cartItems[itemId].quantity= quantity;
    this.cartItems[itemId].total = this.calculateTotalArticle(this.cartItems[itemId].price, quantity);
  }

  async updateCartButton() {
    if (this.userDataService.isSignedIn()) {
      this.apiService.getOneCart(this.userDataService.id).then((data: any) => {
        if (!data.error) {
          let oldCart: { articles: { productId: string; quantity: number }[] } = data;
          let newCart: { articles: { productId: string; quantity: number }[] }={articles:[]};

          this.cartItems.forEach((cartItem) => {
            let existingCartItem = oldCart.articles.find((item) => item.productId === cartItem.productId);

            if (existingCartItem) {
              existingCartItem.quantity = cartItem.quantity;
            }
            newCart.articles.push(<{productId: string, quantity: number}>existingCartItem);
          });

          this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart: newCart}).then();
        }
      });
    }else{
      for (let i = 0; i < this.cartItems.length; i++) {
        updateCart(this.cartItems[i].productId, this.cartItems[i].quantity, true, this.userDataService, this.apiService);

      }
    }
    this.userDataService.updateCartNumberTest();
  }
}
