import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ApiService} from "../../../core/services/api.service";
import {userDataService} from "../../../core/services/userData.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "primeng/api";

@Component({
  selector: 'app-articleform',
  templateUrl: './articleform.component.html',
  styleUrls: ['./articleform.component.css']
})
export class ArticleformComponent {
  isEdit = true;

  articleData = {
    articleId:'',
    title: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    visible: true,
    brand: '',
    searchingKeywords: ''
  };

  messages:Message[] = [];

  constructor(private route:ActivatedRoute, private apiService: ApiService, private userDataService: userDataService, private router: Router) {
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      if(params['articleId']!==undefined){
        this.articleData.articleId = params['articleId'];
        this.isEdit = true;
        this.initializeInputs().then();
      }else{
        this.isEdit = false;
      }
    });
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
      if(!this.isEdit){
        this.apiService.postArticle(<string>this.userDataService.id, <string>this.userDataService.password, {article: articlePost}).then((data:any)=>{
          if(!data.error){
            this.router.navigate(['profile']).then();
          }else{
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }
        });
      }else{
        this.apiService.patchArticle(this.articleData.articleId ,<string>this.userDataService.id, <string>this.userDataService.password, {article: articlePost}).then((data:any)=>{
          if(!data.error){
            this.router.navigate(['profile']).then();
          }else{
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }
        });
      }
    } else {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'The Article Data is not valid'}];
    }
  }

  async initializeInputs(){
    this.apiService.getOneArticle(this.articleData.articleId).then((article:any)=>{
      if(!article.error){
        this.articleData.visible = article.visible;
        this.articleData.brand = article.brand;
        this.articleData.title = article.title;
        this.articleData.price = article.price;
        this.articleData.description = article.description;
        this.articleData.searchingKeywords = article.searchingKeywords.join(', ');
        this.articleData.stockQuantity = article.stockQuantity
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: article.errorText}];
      }
    });
  }
}
