import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {BehaviorSubject, debounceTime, skip} from "rxjs";
import {Article, Echo} from "../../../core/types/echo.type";
import {ApiService} from "../../../core/services/api.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Message} from "primeng/api";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  @Input() contains?: string; // URL Query Param

  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  createInput = '';
  filterInput = new BehaviorSubject<string>('');

  echos = new BehaviorSubject<Echo[]>([]);

  articles: Article[] =[];
  messages: Message[]=[];

  ngOnInit(): void {
    // Assuming getAllArticles is an asynchronous function (returns Promise)
    this.apiService.getAllArticles().then((data: any) => {
      if (!data.error) {
        let countInvis = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].visible) {
            console.log(data[i]);
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
