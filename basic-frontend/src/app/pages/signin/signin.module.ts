import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";


@NgModule({
  declarations: [
    SigninComponent
  ],
    imports: [
        CommonModule,
        SigninRoutingModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        PasswordModule,
        ReactiveFormsModule
    ]
})
export class SigninModule { }
