import { Component } from '@angular/core';
import {Article} from "../../core/types/echo.type";
import {ApiService} from "../../core/services/api.service";
import {userDataService} from "../../core/services/userData.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['../profile/profile.component.css', './seller-profile.component.css']
})
export class SellerProfileComponent {
  brand = "Brand" ;
  email = "email";
  iban = "DE134";
  articles: Article[] =[];
  sellerResult = false;
  constructor(private route: ActivatedRoute, private apiService: ApiService, private userDataService: userDataService) {
  }
  ngOnInit(){
    let sellerId='';
    this.route.params.subscribe(params => {
      sellerId = params['sellerId'];
      console.log(sellerId)
    });
    this.apiService.getOneSeller(sellerId).then((seller:any)=>{
      console.log(seller);
      this.brand = seller.brand;
      this.email = seller.email;
      this.iban = seller.iban;
      this.sellerResult = true;
      this.apiService.getAllArticles().then((data:any)=>{
        if(!data.error){
          console.log(data);
          const filteredArticles = data.filter((article: { seller: string | null; }) => article.seller === sellerId);
          for(let i = 0; i<filteredArticles.length; i++){
            this.articles.push(filteredArticles[i]);
          }
        }
      });
    });
  }
}
