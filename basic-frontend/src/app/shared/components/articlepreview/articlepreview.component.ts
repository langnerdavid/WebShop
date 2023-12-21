import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Article, CartPost} from "../../../core/types/echo.type";
import {ApiService} from "../../../core/services/api.service"
import {Router} from "@angular/router";
import {userDataService} from "../../../core/services/userData.service";
import { updateCartSignedIn} from "../../shared.code";

@Component({
  selector: 'app-articlepreview',
  templateUrl: './articlepreview.component.html',
  styleUrls: ['./articlepreview.component.css']
})
export class ArticlepreviewComponent implements OnChanges{
  @Input()
  articleInfo: Article | undefined;

  product = {
    id: '1',
    name: 'Beispielprodukt',
    price: 19.99,
    description: 'Dies ist ein Beispielprodukt.',
    image: '../../../../assets/ProfilPic.png',
  };
  stockQuantity: number | undefined;

  constructor(private router: Router, private userDataService: userDataService, private apiService: ApiService) {
    this.initializeProduct();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleInfo']) {
      this.initializeProduct();
    }
  }


  private initializeProduct() {
    if (this.articleInfo) {
      this.product.id = this.articleInfo._id;
      this.product.name = this.articleInfo.title;
      this.product.price = this.articleInfo.price;
      this.product.description = this.articleInfo.description;
      this.stockQuantity = this.articleInfo.stockQuantity;
    }
  }


  addToCart(event: Event) {
    console.log('add to cart');
    event.stopPropagation();
    if (this.userDataService.isSignedIn()) {
      updateCartSignedIn(this.product.id, 1, false, this.userDataService, this.apiService)
        .then(() => {
          this.userDataService.updateCartNumberTest();
        })
        .catch((error) => {
          console.error('Error updating cart:', error);
          //TODO Handle the error appropriately
        });
    } else {
      console.log('else');
      this.userDataService.setCartNotSignedIn(this.product.id, 1, false);
    }
  }


  onTitleClicked(){
    console.log(this.product.id)
    this.router.navigate(['/article', this.product.id]);
  }

  protected readonly event = event;
}


