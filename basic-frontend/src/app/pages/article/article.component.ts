import { Component } from '@angular/core';
import {SelectItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/services/api.service";
import {userDataService} from "../../core/services/userData.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent {
  isBuyer = this.userDataSerivce.isBuyer();
  productName: string = 'Mustername';
  productDescription:string = 'Musterbeschreibung';
  productPrice:number = 0;
  productStockQuantity: number = 1;
  productSellerId:string = '';
  selectedQuantity = 1;
  private articleId: string='';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private userDataSerivce: userDataService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.articleId = params['id'];
    });

    this.apiService.getOneArticle(this.articleId).then((data:any)=>{
      console.log(data);
      if(data.error){
        console.log(data.error);
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
    //TODO:  Logik, um Artikel zum Warenkorb hinzuzufügen
    console.log('Menge:', this.selectedQuantity);
    if (this.userDataSerivce.isSignedIn()&&this.userDataSerivce.isBuyer()) {
      this.setCartSignedIn(this.articleId, this.selectedQuantity).then((data:any)=>{
        console.log('ja');
      });
    } else {
      this.userDataSerivce.setCartNotSignedIn(this.articleId, this.selectedQuantity, true);
    }
  }

  goToSellerProfile() {
    //TODO: Logik, um zum Verkäuferprofil zu navigieren
    this.router.navigate(['/sellerProfile', this.productSellerId]); //, this.productSellerId]);
  }

  async setCartSignedIn(articleId:string, quantity: number){
    this.apiService.getOneCart(this.userDataSerivce.id).then((data:any)=>{
      if(data.error === 400){
        this.apiService.postCart(<string>this.userDataSerivce.id, <string>this.userDataSerivce.password, {cart:{articles:[{productId: articleId, quantity: quantity}]}}).then((data:any)=>{
          this.userDataSerivce.updateCartNumberTest();
        });
      }else if (!data.error){
        let cart = data;
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
        console.log(cart);
        this.apiService.patchCart(<string>this.userDataSerivce.id, <string>this.userDataSerivce.password, {cart: cart}).then((data: any)=>{
          if(!data.error){
            this.userDataSerivce.updateCartNumberTest();
          }
        });
      }
    });
  }

}
