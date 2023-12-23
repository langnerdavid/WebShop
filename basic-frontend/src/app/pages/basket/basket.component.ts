import { Component } from '@angular/core';
import {userDataService} from "../../core/services/userData.service";
import {Cart, OrderPost} from "../../core/types/echo.type";
import {ApiService} from "../../core/services/api.service";
import {updateFullCartSignedIn} from "../../shared/shared.code";
import {Router} from "@angular/router";
import {ConfirmationService, Message} from 'primeng/api';


@Component({
  selector: 'app-cart',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
  providers: [ConfirmationService]
})
export class BasketComponent {
  isCartEmpty = true;
  cartItems: { id: number, productId: string, name: string, price: number, quantity: number, total: number , max:number}[] = [];
  cart: Cart | undefined;
  messages: Message[]=[];

  totalAmount: number | undefined;

  constructor(private userDataService: userDataService, private apiService: ApiService, private router: Router, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    if (this.userDataService.isSignedIn()) {
      this.apiService.getOneCart(this.userDataService.id).then((data: any) => {
        if (!data.error) {
          this.cart = data;
          if (this.cart && this.cart?.articles.length !== 0) {
            this.isCartEmpty = false;
            for (let i = 0; <number>this.cart.articles.length > i; i++) {
              this.apiService.getOneArticle(this.cart.articles[i].productId).then((data: any) => {
                if (!data.error) {
                  let article = {
                    id: i,
                    productId: data._id,
                    name: data.title,
                    price: data.price,
                    quantity: this.cart?.articles[i].quantity ?? 1,
                    total: this.calculateTotalArticle(data.price, this.cart?.articles[i].quantity ?? 1),
                    max: data.stockQuantity
                  };
                  this.cartItems.push(article);
                }else{
                  this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
                }
                if (i === <number>this.cart?.articles.length - 1) {
                  this.calculateTotal();
                }
              });
            }
          } else {
            this.isCartEmpty = true;
          }
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        }
      })

    } else {
      this.cart = JSON.parse(<string>this.userDataService.cart);
      if (this.cart) {
        this.isCartEmpty = false;
        for (let i = 0; <number>this.cart?.articles.length > i; i++) {
          this.apiService.getOneArticle(this.cart.articles[i].productId).then((data: any) => {
            if (!data.error) {
              let article = {
                id: i,
                productId: data._id,
                name: data.title,
                price: data.price,
                quantity: this.cart?.articles[i].quantity ?? 1,
                total: this.calculateTotalArticle(data.price, this.cart?.articles[i].quantity ?? 1),
                max: data.stockQuantity
              };
              this.cartItems.push(article);
            }else{
              this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
            }
            if (i === <number>this.cart?.articles.length - 1) {
              this.calculateTotal();
            }
          });
        }
      } else {
        this.isCartEmpty = true;
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
          let newCart: { articles: { productId: string; quantity: number }[] } = {articles: data.articles};
          let productId = this.cartItems.find(item => item.id === itemId)?.productId;
          newCart.articles = newCart.articles.filter((item) => item.productId !== productId);
          // Call the patchCart API to update the cart
          if (newCart.articles.length > 0) {
            this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart: newCart})
              .then((patchData: any) => {
                if(!patchData.error) {
                  this.cartItems = this.cartItems.filter(item => item.id !== itemId);
                  this.userDataService.updateCartNumberTest();
                  this.calculateTotal();
                }else{
                  this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
                }
              });
          } else {
            this.apiService.deleteCart(<string>this.userDataService.id, <string>this.userDataService.password).then((data:any) => {
              if(!data.error){
                this.isCartEmpty = true;
                this.cart = undefined;
                this.userDataService.updateCartNumberTest();
              }else{
                this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
              }
            })
          }
        }else{
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        }
      });
      this.cartItems.forEach((item, index) => {
        item.id = index;
      });
      this.updateDisplayCart();
    } else {
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
      this.cartItems.forEach((item, index) => {
        item.id = index;
      });
      // Set the updated cart object in the user data service
      this.updateDisplayCart();
    }
  }

  onQuantityChange(quantity: number, itemId: number) {
    this.calculateTotal();
    this.cartItems[itemId].quantity = quantity;
    this.updateOrder();
    this.cartItems[itemId].total = this.calculateTotalArticle(this.cartItems[itemId].price, quantity);
    this.updateDisplayCart();
  }

  async updateOrder() {
    if (this.userDataService.isSignedIn()) {
      updateFullCartSignedIn(this.cartItems, this.userDataService, this.apiService).then((data: any) => {
        if (!data.error) {
          this.cartItems = data;
          this.userDataService.updateCartNumberTest();
        }
      }).catch(() => {
        //TODO error handling
      });
    } else {
      for (let i = 0; i < this.cartItems.length; i++) {
        this.userDataService.setCartNotSignedIn(this.cartItems[i].productId, this.cartItems[i].quantity, true);

      }
      this.userDataService.updateCartNumberTest();
      //TODO maybe hier noch ein pop up zum bestätigen
      //this.router.navigate(['/register']);
    }
  }

  private updateDisplayCart() {
    if (this.cartItems.length === 0) {
      this.isCartEmpty = true;
    }
    this.userDataService.updateCartNumberTest();
    this.calculateTotal();
  }

  confirmOrder() {
    if(this.userDataService.isSignedIn()){
      this.confirmationService.confirm({
        message: 'Do you really want to complete this order? You have to manually pay the requested price!',
        accept: () => {
          this.completeOrder();
        },
        reject: () => {

        }
      });
    }else{
      this.router.navigate(['/profile'])
    }
  }

  completeOrder(){
    let order: OrderPost = { articles: [] , status:'placed'};
    for(let i = 0; i< this.cartItems.length; i++){
      order.articles.push({productId: this.cartItems[i].productId, quantity:this.cartItems[i].quantity});
    }
    this.apiService.postOrder(<string>this.userDataService.id, <string>this.userDataService.password, {order: order}).then((order:any)=>{
      if(!order.error){
        this.apiService.deleteCart(<string>this.userDataService.id, <string>this.userDataService.password).then((data:any)=>{
          if(!data.error){
            this.userDataService.updateCartNumberTest();
            this.router.navigate(['/profile']);
          }
        })
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: order.errorText}];
      }
    });
  }

}
