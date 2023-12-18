import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { userDataService } from 'src/app/core/services/userData.service';
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ArticleComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    InputNumberModule,
    ButtonModule,
    FormsModule
  ]
})
export class ArticleModule {
  private userDataService = inject(userDataService);
  ngDoCheck(){
    this.userDataService.updateData();
  }
}
