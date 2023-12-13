import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ArticlepreviewComponent } from './components/articlepreview/articlepreview.component';
import {ButtonModule} from "primeng/button";

@NgModule({
  declarations: [
    ArticlepreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ArticlepreviewComponent
  ]
})
export class SharedModule {
}
