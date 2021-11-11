
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ErrorMsg, MsgLevel } from '../../model/errorMsg';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrls: [
    './error-message.component.scss'
  ]
})
export class ErrorMessageComponent implements OnInit, OnChanges {

  @Input() public error: ErrorMsg | undefined | null;

  public messageLevel: MsgLevel;
  public messageTitle: string;
  public genericMessage: string;
  public childMessages: string[];

  public ngOnInit() {
    this.updateErrorDetails();
  }

  public ngOnChanges() {
    this.updateErrorDetails();
  }

  private updateErrorDetails() {

    if (!!this.error) {
      this.messageLevel = this.error.level;
      this.messageTitle = this.error.title;
      this.genericMessage = this.error.msg;
      this.childMessages = !! this.error.details ? this.error.details : [];
    }
  }
}
