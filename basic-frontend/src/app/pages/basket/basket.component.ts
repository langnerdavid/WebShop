import { Component } from '@angular/core';
import {userDataService} from "../../core/services/userData.service";
import {Cart} from "../../core/types/echo.type";
import {ApiService} from "../../core/services/api.service";
import {updateFullCartSignedIn} from "../../shared/shared.code";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Router} from "@angular/router";


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
  constructor(private userDataService: userDataService, private apiService:ApiService, private router:Router) {
  }
  ngOnInit(){
    if(this.userDataService.isSignedIn()){
      this.apiService.getOneCart(this.userDataService.id).then((data:any)=>{
        if(!data.error){
          this.cart = data;
          if(this.cart && this.cart?.articles.length !== 0){
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
      }else{
        this.isCartEmpty=true;
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
          let productId = this.cartItems.find(item => item.id === itemId)?.productId;
          newCart.articles = newCart.articles.filter((item) => item.productId !== productId);
          // Call the patchCart API to update the cart
          if(newCart.articles.length>0){
            this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, { cart: newCart })
              .then((patchData: any) => {
                this.cartItems = this.cartItems.filter(item => item.id !== itemId);
                this.userDataService.updateCartNumberTest();
                this.calculateTotal();
              })
              .catch((patchError: any) => {
                console.error('Error patching cart:', patchError);
              });
          }else{
            this.apiService.deleteCart(data._id, <string>this.userDataService.id, <string>this.userDataService.password).then(()=>{
              console.log('cart deleted');
              this.isCartEmpty = true;
              this.cart =undefined;
              this.userDataService.updateCartNumberTest();
            })
          }
        }
      });
      this.updateDisplayCart();
    }else {
      let index = this.cartItems.findIndex(item => item.id === itemId);
      let newCart = JSON.parse(<string>this.userDataService.cart);

      // Create a new cart object with updated articles
      const updatedCart = {
        articles: newCart.articles.filter((item: {
          productId: string,
          quantity: number
        }) => item.productId !== this.cartItems[index].productId)
      };
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.userDataService.setFullCartNotSignedIn(updatedCart);
      if (this.cartItems.length === 0) {
        this.userDataService.deleteCartNotSignedIn();
        this.isCartEmpty = true;
      }
      // Set the updated cart object in the user data service
      this.updateDisplayCart();
    }
  }

  onQuantityChange(quantity:number, itemId: number){
    this.calculateTotal();
    this.cartItems[itemId].quantity= quantity;
    this.cartItems[itemId].total = this.calculateTotalArticle(this.cartItems[itemId].price, quantity);
  }

  async completeOrder() {
    if (this.userDataService.isSignedIn()) {
      updateFullCartSignedIn(this.cartItems, this.userDataService, this.apiService).then((data:any)=>{
        if(!data.error){
          this.cartItems = data;
          this.userDataService.updateCartNumberTest();
        }
      }).catch(()=>{
        //TODO error handling
      });
    }else{
      for (let i = 0; i < this.cartItems.length; i++) {
        this.userDataService.setCartNotSignedIn(this.cartItems[i].productId, this.cartItems[i].quantity, true);

      }
      this.userDataService.updateCartNumberTest();
      //TODO maybe hier noch ein pop up zum bestätigen
      this.router.navigate(['/register']);
    }
  }

  private updateDisplayCart(){
    if (this.cartItems.length === 0) {
      this.isCartEmpty = true;
    }
    this.userDataService.updateCartNumberTest();
    this.calculateTotal();
  }
}
