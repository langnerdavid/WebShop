import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {BehaviorSubject, debounceTime, skip} from "rxjs";
import {Article, Echo} from "../../../core/types/echo.type";
import {ApiService} from "../../../core/services/api.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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

  ngOnInit(): void {
      // Assuming getAllArticles is an asynchronous function (returns Promise)
    this.apiService.getAllArticles().then((data: any) => {
      if(!data.error){
        let countInvis = 0;
        for(let i = 0; i<data.length; i++){
          if(data[i].visible){
            console.log(data[i]);
            this.articles[i-countInvis] = data[i];
          }else{
            countInvis +=1;
          }
        }
      }
    });

    void this.loadEchos(this.contains);

    if (this.contains) {
      this.filterInput.next(this.contains);
    }

    this.filterInput.pipe(
      skip(1),
      debounceTime(400),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((next) => {
      void this.loadEchos(next);
    });
  }

  async addEcho(): Promise<void> {
    const newEcho = await this.apiService.createEcho({
      message: this.createInput
    });
    const newEchoList = [...this.echos.value, newEcho];
    newEchoList.sort((a, b) => a.message.localeCompare(b.message));
    this.echos.next(newEchoList);
  }

  async loadEchos(filter?: string): Promise<void> {
    const echos = await this.apiService.getEchos(filter);
    echos.sort((a, b) => a.message.localeCompare(b.message));
    this.echos.next(echos);
  }

  async error(): Promise<void> {
    try {
      await this.apiService.doError();
      console.log('This will never trigger.')
    } catch (err) {
      console.log('Error caught in Component:', err);
    }
  }
}
