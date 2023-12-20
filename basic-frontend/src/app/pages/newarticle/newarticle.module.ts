import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewarticleRoutingModule } from './newarticle-routing.module';
import { NewarticleComponent } from './newarticle.component';
import {FormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";


@NgModule({
  declarations: [
    NewarticleComponent
  ],
  imports: [
    CommonModule,
    NewarticleRoutingModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    InputNumberModule,
    InputTextareaModule
  ]
})
export class NewarticleModule { }
