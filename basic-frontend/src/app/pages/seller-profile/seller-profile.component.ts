import { Component } from '@angular/core';
import {Article} from "../../core/types/echo.type";
import {ApiService} from "../../core/services/api.service";
import {userDataService} from "../../core/services/userData.service";
import {ActivatedRoute} from "@angular/router";
import {Message} from "primeng/api";


@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['../profile/profile.component.css', '../welcome/welcome-page/welcome-page.component.css','./seller-profile.component.css']
})
export class SellerProfileComponent {
  brand = "Brand" ;
  email = "email";
  iban = "DE134";
  articles: Article[] =[];
  sellerResult = false;
  messages: Message[]=[];
  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }
  ngOnInit(){
    let sellerId='';
    this.route.params.subscribe(params => {
      sellerId = params['sellerId'];
    });
    this.apiService.getOneSeller(sellerId).then((seller:any)=>{
      if(!seller.error){
        this.brand = seller.brand;
        this.email = seller.email;
        this.iban = seller.iban;
        this.sellerResult = true;
        this.apiService.getAllArticles().then((data:any)=>{
          if(!data.error){
            const filteredArticles = data.filter((article: { seller: string | null; }) => article.seller === sellerId);
            for(let i = 0; i<filteredArticles.length; i++){
              this.articles.push(filteredArticles[i]);
            }
          }else{
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }
        });
      }else {
        this.messages = [{ severity: 'error', summary: 'Error', detail: seller.errorText}];
      }
    });
  }
}
