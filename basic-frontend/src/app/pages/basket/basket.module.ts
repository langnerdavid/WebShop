import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasketRoutingModule } from './basket-routing.module';
import { BasketComponent } from './basket.component';
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";


@NgModule({
  declarations: [
    BasketComponent
  ],
  imports: [
    CommonModule,
    BasketRoutingModule,
    CardModule,
    TableModule,
    InputNumberModule,
    FormsModule,
    ButtonModule
  ]
})
export class BasketModule { }
