import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultsRoutingModule } from './search-results-routing.module';
import { SearchResultsComponent } from './search-results.component';
import {ActivatedRoute} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {MessagesModule} from "primeng/messages";


@NgModule({
  declarations: [
    SearchResultsComponent
  ],
    imports: [
        CommonModule,
        SearchResultsRoutingModule,
        SharedModule,
        MessagesModule
    ]
})
export class SearchResultsModule {
}

