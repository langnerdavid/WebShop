import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ArticlepreviewComponent } from './components/articlepreview/articlepreview.component';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import { ArticleformComponent } from './components/articleform/articleform.component';
import {CheckboxModule} from "primeng/checkbox";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";

@NgModule({
  declarations: [
    ArticlepreviewComponent,
    ArticleformComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RouterLink,
        CheckboxModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule
    ],
  exports: [
    CommonModule,
    FormsModule,
    ArticlepreviewComponent,
    ArticleformComponent
  ]
})
export class SharedModule {
}
