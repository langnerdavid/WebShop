import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerProfileRoutingModule } from './seller-profile-routing.module';
import { SellerProfileComponent } from './seller-profile.component';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AccordionModule} from "primeng/accordion";
import {TableModule} from "primeng/table";
import {SharedModule} from "../../shared/shared.module";
import {MessagesModule} from "primeng/messages";


@NgModule({
  declarations: [
    SellerProfileComponent
  ],
    imports: [
        CommonModule,
        SellerProfileRoutingModule,
        ButtonModule,
        CardModule,
        ReactiveFormsModule,
        FormsModule,
        AccordionModule,
        TableModule,
        SharedModule,
        MessagesModule
    ]
})
export class SellerProfileModule { }
