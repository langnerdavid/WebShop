import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-newarticle',
  templateUrl: './newarticle.component.html',
  styleUrls: ['./newarticle.component.css']
})
export class NewarticleComponent {
  articleData = {
    title: '',
    description: '',
    price: null,
    stockQuantity: null,
    available: false,
    brand: '',
    searchingKeywords: ''
  };

  messages = [];

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(this.articleData);
    } else {
      console.log('error creating article');
    }
  }
}
