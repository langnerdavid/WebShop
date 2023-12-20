import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../core/services/api.service";
import {Article} from "../../core/types/echo.type";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  searchText: string = '';
  articles: Article[] =[];
  searchResult = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    // Move the route subscription logic inside a method
    this.subscribeToRouteParams();
    this.getSeatchResults().then(r => console.log('yes'));

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
        console.log(data);
        this.articles = data.filter((item: { searchingKeywords: string[]; visible: boolean }) => {
          const isVisible = item.visible;
          const hasMatchingKeyword = item.searchingKeywords.some(keyword => keyword.toLowerCase().includes(this.searchText));
          return isVisible && hasMatchingKeyword;
        });
        if(this.articles.length > 0){
          this.searchResult = true;
        }
      }
    });
  }
}
