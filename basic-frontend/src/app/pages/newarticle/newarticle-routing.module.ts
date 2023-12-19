import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewarticleComponent } from './newarticle.component';

const routes: Routes = [{ path: '', component: NewarticleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewarticleRoutingModule { }
