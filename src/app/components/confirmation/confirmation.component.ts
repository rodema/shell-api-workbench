
import { Component } from '@angular/core';
import { DialogRef } from '@fundamental-ngx/core';

export interface ConfirmationComponentData {
  title: string;
  message: string;
  yesLabel: string;
  noLabel: string;
  messageParams: { [key: string]: string } | undefined;
}

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: [
    './confirmation.component.scss'
  ]
})
export class ConfirmationComponent {

  public data: ConfirmationComponentData;

  constructor(

    public dialogRef: DialogRef
  ) {
    this.data = this.dialogRef.data;
    if (!this.data.messageParams) {
      this.data.messageParams = {};
    }
  }

}
