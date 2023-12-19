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
    available: true,
    brand: '',
    searchingKeywords: '',
  };

  constructor() {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Article Data:', this.articleData);
    } else {
      console.log('Form is not valid.');
    }
  }
}
