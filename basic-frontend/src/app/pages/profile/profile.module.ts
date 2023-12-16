import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";


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
      FormsModule
    ]
})
export class ProfileModule { }
