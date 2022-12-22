import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiWorkbench } from './api-workbench.component';
import { FileUploadComponent} from './components/fileUpload/file-upload.component';

import { ShellPayloadValidationService } from './services/shell-payload-validation.service';
import { ButtonModule, DialogModule, DialogService } from '@fundamental-ngx/core';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { AppRoutingModule } from './api-workbench.routing.module';

import { StartPage } from './start-page.component';

@NgModule({
  declarations: [
    ApiWorkbench,
    ConfirmationComponent,
    ErrorMessageComponent,
    FileUploadComponent,
    StartPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    AppRoutingModule],
  exports: [
    ConfirmationComponent],
  entryComponents: [
    ConfirmationComponent],
  providers: [
    ShellPayloadValidationService,
    DialogService
  ],
  bootstrap: [StartPage]
})
export class AppModule { }
