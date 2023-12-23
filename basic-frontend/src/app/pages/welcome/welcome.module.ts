import {inject, NgModule} from '@angular/core';

import {WelcomeRoutingModule} from './welcome-routing.module';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {SharedModule} from "../../shared/shared.module";
import { userDataService } from 'src/app/core/services/userData.service';
import {ButtonModule} from "primeng/button";
import {MessagesModule} from "primeng/messages";

@NgModule({
  declarations: [
    WelcomePageComponent
  ],
    imports: [
        SharedModule,
        WelcomeRoutingModule,
        ButtonModule,
        MessagesModule
    ]
})
export class WelcomeModule {
}
