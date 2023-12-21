import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailedRoutingModule } from './order-detailed-routing.module';
import { OrderDetailedComponent } from './order-detailed.component';
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";


@NgModule({
  declarations: [
    OrderDetailedComponent
  ],
  imports: [
    CommonModule,
    OrderDetailedRoutingModule,
    CardModule,
    DropdownModule,
    TableModule,
    FormsModule,
    ButtonModule
  ]
})
export class OrderDetailedModule { }
