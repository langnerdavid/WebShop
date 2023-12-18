import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ArticlepreviewComponent } from './components/articlepreview/articlepreview.component';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    ArticlepreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterLink
  ],
  exports: [
    CommonModule,
    FormsModule,
    ArticlepreviewComponent
  ]
})
export class SharedModule {
}
