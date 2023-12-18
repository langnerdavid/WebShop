import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Article} from "../../../core/types/echo.type";
import {ApiService} from "../../../core/services/api.service"

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

  constructor() {
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


  addToCart() {
    console.log('Produkt hinzugefügt:', this.product.id);
  }
}


