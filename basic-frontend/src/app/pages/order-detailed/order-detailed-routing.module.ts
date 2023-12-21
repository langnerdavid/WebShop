import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailedComponent } from './order-detailed.component';

const routes: Routes = [{ path: '', component: OrderDetailedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderDetailedRoutingModule { }
