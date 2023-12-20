import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import { userDataService } from 'src/app/core/services/userData.service';
import {ToastModule} from "primeng/toast";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {AccordionModule} from "primeng/accordion";
import {CheckboxModule} from "primeng/checkbox";


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CardModule,
    TableModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    ConfirmPopupModule,
    AccordionModule,
    CheckboxModule
  ]
})
export class ProfileModule {
  private userDataService = inject(userDataService);
  ngDoCheck(){
    this.userDataService.updateData();
  }
}
