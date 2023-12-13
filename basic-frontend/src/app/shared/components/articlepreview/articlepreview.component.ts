import { Component } from '@angular/core';

@Component({
  selector: 'app-articlepreview',
  templateUrl: './articlepreview.component.html',
  styleUrls: ['./articlepreview.component.css']
})
export class ArticlepreviewComponent {
  product = {
    id: 1,
    name: 'Beispielprodukt',
    price: 19.99,
    description: 'Dies ist ein Beispielprodukt.',
    image: '../../../../assets/ProfilPic.png'
  };

  addToCart() {
    console.log('Produkt hinzugefügt:', this.product.id);
  }
}


