import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { userDataService } from 'src/app/core/services/userData.service';


@NgModule({
  declarations: [
    ArticleComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule {
  private userDataService = inject(userDataService);
  ngDoCheck(){
    this.userDataService.updateData();
  }
}
