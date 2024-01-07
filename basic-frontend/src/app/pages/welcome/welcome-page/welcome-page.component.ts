import {Component, inject, Input, OnInit} from '@angular/core';
import {Article} from "../../../core/types/echo.type";
import {ApiService} from "../../../core/services/api.service";
import {Message} from "primeng/api";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  @Input() contains?: string; // URL Query Param

  private apiService = inject(ApiService);

  articles: Article[] =[];
  messages: Message[]=[];

  ngOnInit(): void {
    // Assuming getAllArticles is an asynchronous function (returns Promise)
    this.apiService.getAllArticles().then((data: any) => {
      if (!data.error) {
        let countInvis = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].visible) {
            this.articles[i - countInvis] = data[i];
          } else {
            countInvis += 1;
          }
        }
      } else {
        this.messages = [{severity: 'error', summary: 'Error', detail: data.errorText}];
      }
    });
  }
}
