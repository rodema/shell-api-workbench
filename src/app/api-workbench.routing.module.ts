import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiWorkbench } from './api-workbench.component';

const routes: Routes = [
  {
    path: 'EventOnStart/:eventName',    // Route with Parameter
    component: ApiWorkbench
  },
  {
    path: '',                 // Route without parameter
    component: ApiWorkbench
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }