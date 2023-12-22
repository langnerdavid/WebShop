import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewarticleRoutingModule } from './newarticle-routing.module';
import { NewarticleComponent } from './newarticle.component';
import {FormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MessagesModule} from "primeng/messages";
import {InputTextModule} from "primeng/inputtext";
import {SharedModule} from "../../shared/shared.module";


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
        InputTextareaModule,
        MessagesModule,
        InputTextModule,
        SharedModule
    ]
})
export class NewarticleModule { }
