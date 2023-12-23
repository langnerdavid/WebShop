import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasketRoutingModule } from './basket-routing.module';
import { BasketComponent } from './basket.component';
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MessagesModule} from "primeng/messages";
import {RippleModule} from "primeng/ripple";


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
        ButtonModule,
        ConfirmDialogModule,
        MessagesModule,
        RippleModule
    ]
})
export class BasketModule {

}
