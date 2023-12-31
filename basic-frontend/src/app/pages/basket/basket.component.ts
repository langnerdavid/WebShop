import { Component } from '@angular/core';
import {userDataService} from "../../core/services/userData.service";
import {Cart} from "../../core/types/echo.type";
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
    // Initialize Cart Data depending on whether the user is signed in or not
    if (this.userDataService.isSignedIn()) {
      this.apiService.getOneCart(this.userDataService.id).then((data: any) => {
        if (!data.error) {
          this.cart = data;
          if (this.cart && this.cart?.articles.length !== 0) {
            this.isCartEmpty = false;
            for (let i = 0; <number>this.cart.articles.length > i; i++) {
              this.setArticleData(i);
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
          this.setArticleData(i)
        }
      } else {
        this.isCartEmpty = true;
      }
    }
  }

  //calculates Total of Order
  calculateTotal() {
    const rawTotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.totalAmount = parseFloat(rawTotal.toFixed(2));
  }

  //calculates Total of one Article
  calculateTotalArticle(price: number, quantity: number): number {
    const total = price * quantity;
    return Math.round(total * 100) / 100;
  }

  removeFromCart(itemId: number) {
    if (this.userDataService.isSignedIn()) {
      this.apiService.getOneCart(this.userDataService.id).then((data: any) => {
        if (!data.error) {
          const newCart: { articles: { productId: string; quantity: number }[] } = {articles: data.articles};
          const productId = this.cartItems.find(item => item.id === itemId)?.productId;
          newCart.articles = newCart.articles.filter((item) => item.productId !== productId);
          // Call the patchCart API to update the cart
          if (newCart.articles.length > 0) {
            this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart: newCart})
              .then((patchData: any) => {
                if(!patchData.error) {
                  this.cartItems = this.cartItems.filter(item => item.id !== itemId);
                  this.cartItems.forEach((item, index) => {
                    item.id = index;
                  });
                  console.log(this.cartItems);
                  this.userDataService.updateCartNumber();
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
                this.userDataService.updateCartNumber();
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
      const index = this.cartItems.findIndex(item => item.id === itemId);
      const newCart = JSON.parse(<string>this.userDataService.cart);

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
    this.updateOrder().then();
    this.cartItems[itemId].total = this.calculateTotalArticle(this.cartItems[itemId].price, quantity);
    this.updateDisplayCart();
  }

  async updateOrder() {
    if (this.userDataService.isSignedIn()) {
      updateFullCartSignedIn(this.cartItems, this.userDataService, this.apiService).then((data: any) => {
        if (!data.error) {
          this.cartItems = data;
          this.userDataService.updateCartNumber();
        }
      }).catch((e) => {
        console.log(e);
      });
    } else {
      for (let i = 0; i < this.cartItems.length; i++) {
        this.userDataService.setCartNotSignedIn(this.cartItems[i].productId, this.cartItems[i].quantity, true);

      }
      this.userDataService.updateCartNumber();
    }
  }

  private updateDisplayCart() {
    if (this.cartItems.length === 0) {
      this.isCartEmpty = true;
    }
    this.userDataService.updateCartNumber();
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
      this.router.navigate(['/signin']).then();
    }
  }

  completeOrder() {
    const orderMap = new Map();

    // Use Promise.all to wait for all asynchronous calls to complete
    const promises = this.cartItems.map(async (cartItem) => {
      const data:any = await this.apiService.getOneArticle(cartItem.productId);
      if (!data.error) {
        console.log(data);
        const seller = data.seller;
        // Wenn der Seller noch nicht in der Map ist, füge ihn hinzu
        if (!orderMap.has(seller)) {
          orderMap.set(seller, { articles: [] });
        }
        // Füge den Artikel zur entsprechenden Bestellung hinzu
        orderMap.get(seller).articles.push({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        });
      }
    });

    // Wait for all promises to resolve
    Promise.all(promises)
        .then(() => {
          orderMap.forEach((order, seller) => {
            console.log(`Seller: ${seller}, Order: `, order);
            order.status = 'placed';
            this.apiService.postOrder(
                <string>this.userDataService.id,
                <string>this.userDataService.password,
                { order: order }
            ).then((order: any) => {
              if (!order.error) {
                this.apiService
                    .deleteCart(<string>this.userDataService.id, <string>this.userDataService.password)
                    .then((data: any) => {
                      if (!data.error) {
                        this.router.navigate(['/profile']).then(()=>{
                          this.userDataService.updateCartNumberLog(0);
                        });
                      }
                    });
              } else {
                this.messages = [
                  { severity: 'error', summary: 'Error', detail: order.errorText },
                ];
              }
            });
          });
        })
        .catch((error) => {
          console.error('Error fetching articles:', error);
        });
  }



  setArticleData(i:number){
    // @ts-ignore
    this.apiService.getOneArticle(this.cart.articles[i].productId).then((data: any) => {
      if (!data.error) {
        const article = {
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
}
