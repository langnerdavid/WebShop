import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ApiService} from "../../../core/services/api.service";
import {userDataService} from "../../../core/services/userData.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-articleform',
  templateUrl: './articleform.component.html',
  styleUrls: ['./articleform.component.css']
})
export class ArticleformComponent {
  isEdit = true;

  articleData = {
    title: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    visible: true,
    brand: '',
    searchingKeywords: ''
  };

  messages = [];

  constructor(private apiService: ApiService, private userDataService: userDataService, private router: Router) {
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      let articlePost = {
        title: this.articleData.title,
        description: this.articleData.description,
        price: this.articleData.price,
        stockQuantity: this.articleData.stockQuantity,
        visible: this.articleData.visible,
        brand: this.articleData.brand,
        searchingKeywords: this.articleData.searchingKeywords.split(',').map(keyword => keyword.trim())
      };
      this.apiService.postArticle(<string>this.userDataService.id, <string>this.userDataService.password, {article: articlePost}).then((data:any)=>{
        this.router.navigate(['profile']);
      });
    } else {
      console.log('error creating article');
    }
  }
}
