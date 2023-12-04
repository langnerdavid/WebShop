import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";


@NgModule({
  declarations: [
    RegisterComponent
  ],
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        PasswordModule,
        ReactiveFormsModule
    ]
})
export class RegisterModule { }
