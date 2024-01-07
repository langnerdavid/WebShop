import { Component } from '@angular/core';
import {Message} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/services/api.service";
import {userDataService} from "../../core/services/userData.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent {
  isSeller = this.userDataService.isSeller();
  productName = 'Mustername';
  productDescription = 'Musterbeschreibung';
  productPrice = 0;
  productStockQuantity = 1;
  productSellerId = '';
  selectedQuantity = 1;
  private articleId='';

  messages: Message[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private userDataService: userDataService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.articleId = params['id'];
    });

    this.apiService.getOneArticle(this.articleId).then((data:any)=>{
      if(data.error){
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        return
      }else {
        this.productName = data.title;
        this.productDescription = data.description;
        this.productPrice = data.price;
        this.productSellerId = data.seller;
        this.productStockQuantity = data.stockQuantity;
      }

    })
  }

  addToCart() {
    if (this.userDataService.isSignedIn()&&this.userDataService.isBuyer()) {
      this.setCartSignedIn(this.articleId, this.selectedQuantity).then((data:any)=>{
        if(data.error){
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        }
      });
    } else {
      this.userDataService.setCartNotSignedIn(this.articleId, this.selectedQuantity, true);
    }
  }

  goToSellerProfile() {
    this.router.navigate(['/sellerProfile', this.productSellerId]).then(); //, this.productSellerId]);
  }

  async setCartSignedIn(articleId:string, quantity: number){
    this.apiService.getOneCart(this.userDataService.id).then((data:any)=>{
      if(data.error === 400){
        this.apiService.postCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart:{articles:[{productId: articleId, quantity: quantity}]}}).then((data:any)=>{
          if(data.error){
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }else {
            this.userDataService.updateCartNumberTest();
          }
        });
      }else if (!data.error){
        const cart = data;
        let isExecuted = false;
        for(let i = 0; i<cart.articles.length; i++){
          if(cart.articles[i].productId === articleId){
            cart.articles[i].quantity += quantity;
            isExecuted=true;
          }
        }
        if(!isExecuted){
          cart.push({productId: articleId, quantity: quantity});
        }
        this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart: cart}).then((data: any)=>{
          if(!data.error){
            this.userDataService.updateCartNumberTest();
          }else{
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }
        });
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
      }
    });
  }

}
