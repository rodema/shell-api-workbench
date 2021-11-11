import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { ApiWorkbench } from './api-workbench.component';

@NgModule({
  declarations: [
    ApiWorkbench
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [ApiWorkbench]
})
export class AppModule { }
