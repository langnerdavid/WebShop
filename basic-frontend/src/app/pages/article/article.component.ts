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
    if(this.userDataSerivce.isSeller()){

    }else{
      this.userDataSerivce.setCartNotSignedIn(this.articleId, this.selectedQuantity, true);
    }
  }

  goToSellerProfile() {
    //TODO: Logik, um zum Verkäuferprofil zu navigieren
    this.router.navigate(['/seller', this.productSellerId]);
  }

}
