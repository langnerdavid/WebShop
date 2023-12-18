import { Component } from '@angular/core';
import {SelectItem} from "primeng/api";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent {

  selectedQuantity = 1;

  constructor() { }

  addToCart() {
    //TODO:  Logik, um Artikel zum Warenkorb hinzuzufügen
    console.log('Menge:', this.selectedQuantity);
  }

  goToSellerProfile() {
    //TODO: Logik, um zum Verkäuferprofil zu navigieren
  }

}
