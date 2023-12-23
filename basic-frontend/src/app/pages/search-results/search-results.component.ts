import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../core/services/api.service";
import {Article} from "../../core/types/echo.type";
import {Message} from "primeng/api";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['../welcome/welcome-page/welcome-page.component.css', './search-results.component.css']
})
export class SearchResultsComponent {
  searchText = '';
  articles: Article[] =[];
  searchResult = false;

  messages: Message[]=[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    // Move the route subscription logic inside a method
    this.subscribeToRouteParams();
    this.getSeatchResults().then(() => {

    });

  }

  private subscribeToRouteParams() {
    this.route.params.subscribe(params => {
      this.searchText = params['searchText'];
      this.getSeatchResults();
      // You can perform any additional logic here based on the route params
    });
  }
  private async getSeatchResults(){
    this.apiService.getAllArticles().then((data:any)=>{
      if(!data.error){
        this.articles = data.filter((item: { searchingKeywords: string[]; visible: boolean }) => {
          const isVisible = item.visible;
          const hasMatchingKeyword = item.searchingKeywords.some(keyword => keyword.toLowerCase().includes(this.searchText.toLowerCase()));
          return isVisible && hasMatchingKeyword;
        });
        if(this.articles.length > 0){
          this.searchResult = true;
        }
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
      }
    });
  }
}
