import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditArticleRoutingModule } from './edit-article-routing.module';
import { EditArticleComponent } from './edit-article.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    EditArticleComponent
  ],
    imports: [
        CommonModule,
        EditArticleRoutingModule,
        SharedModule
    ]
})
export class EditArticleModule { }
