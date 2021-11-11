import { Component } from '@angular/core';
import { ShellSdk, SHELL_EVENTS } from 'fsm-shell';
import { payloadProposalList } from './payload.proposal';
import { payloadTemplateList} from './payload.template';
import { EventHander } from './event-hander';
import { Event } from './model/event';
import { OutputInterface } from './output-interface';
import { ShellPayloadValidationService } from './services/shell-payload-validation.service';
import { ErrorMsg, MsgLevel} from './model/errorMsg';
import { PayloadTemplate } from './model/payloadTemplate';
import { SHELL_API_WORKBENCH_VERSION_INFO } from '../ShellApiWorkbenchVersionInfo';
import * as uuid from 'uuid';

// import { ConfirmationComponent } from './components/confirmation/confirmation.component';
// import { DialogService } from '@fundamental-ngx/core';
@Component({
  selector: 'api-workbench-root',
  templateUrl: './api-workbench.component.html',
  styleUrls: ['./api-workbench.component.scss']
})
export class ApiWorkbench implements OutputInterface {
  public output: string = '';
  public cmdPayload: string = '';
  public apiSentEvent: string = '';
  public apiSentEventList: Event[] = new Array();
  public apiAdditionalEventList: Event[] = new Array();
  public apiReceiveOnlyEventList: string[] = new Array();
  public apiDeprecatedEventList: string[] = new Array();
  public apiAllEventList: Event[] = new Array();
  public eventHandler: EventHander[] = new Array();
  public displayError: ErrorMsg;
  private shellSdk: ShellSdk;
  private payloadTemplateList: PayloadTemplate[];
  private completePayloadTemplateList: PayloadTemplate[];

  constructor(
    private shellPayloadValidationService: ShellPayloadValidationService
  ) { }

  public ngOnInit() {
    this.clearMsgDialog();

    // tslint:disable-next-line
    console.log(`Shell API Workbench version : ${SHELL_API_WORKBENCH_VERSION_INFO.VERSION}, ${SHELL_API_WORKBENCH_VERSION_INFO.BUILD_TS}`);

    this.apiAdditionalEventList.push( {id: SHELL_EVENTS.ERROR, name: SHELL_EVENTS.ERROR, receiveOnly: true, isRegistered: false} );

    this.apiReceiveOnlyEventList.push( SHELL_EVENTS.Version1.SET_VIEW_STATE,
                                       SHELL_EVENTS.ERROR );

    this.apiDeprecatedEventList.push( SHELL_EVENTS.Version1.GET_STORAGE_ITEM,
                                      SHELL_EVENTS.Version1.GET_PERMISSIONS );

    let eventsV1 = Object.keys(SHELL_EVENTS.Version1);
    // filter PRIVATE, OUTLET, MODAL Events
    eventsV1 = eventsV1.filter( eventName => (eventName !== 'PRIVATE') && (eventName !== 'OUTLET') && (eventName !== 'MODAL') );
    let eventsV2 = Object.keys(SHELL_EVENTS.Version2);

    eventsV1.forEach( apiEvent => {
      const eventName = 'V1.' + apiEvent;
      this.apiSentEventList.push( { id: eventName, name: eventName, receiveOnly: false, isRegistered: false});
    });

    eventsV2.forEach( apiEvent => {
      const eventName = 'V2.' + apiEvent;
      this.apiSentEventList.push( { id: eventName, name: eventName, receiveOnly: false, isRegistered: false });
    });

    // combine list of all events
    this.apiAllEventList = this.apiSentEventList.concat(this.apiAdditionalEventList);

    // remove deprecated events
    this.apiDeprecatedEventList.forEach(element => {
      const index = this.apiAllEventList.findIndex( searchElement => searchElement.name === element );
      if (index >= 0) {
         this.apiAllEventList.splice(index, 1);
      }
    });

    // mark the events that can't be sent, but only received
    this.apiReceiveOnlyEventList.forEach(element => {
      let apiEvent = this.apiAllEventList.find( event => event.id === element );
      apiEvent.receiveOnly = true;
    });

    this.cmdPayload = '';

    // Load SAP provided default payload
    // Open point: How to reset the selected entry in payload template DDLB
    this.payloadTemplateList = [];
    this.completePayloadTemplateList = payloadTemplateList;

    // tslint:disable-next-line
    console.log('using ShellSdk version', ShellSdk.VERSION);
    if (!ShellSdk.isInsideShell()) {
      this.openErrorDialog( MsgLevel.FatalError,
                            MsgLevel.FatalError,
                            'Extension is not started inside Shell');
      throw new Error('unable to reach shell eventAPI');
    }

    this.shellSdk = ShellSdk.init(parent, '*');
    this.shellSdk.setValidator(this.shellPayloadValidationService);
  }

  public onApiEventChanged(event: string) {
    const eventPayloadProposal = payloadProposalList.find( payload => payload.event === event);
    eventPayloadProposal ? this.cmdPayload = eventPayloadProposal.payload : this.cmdPayload = '';

    // Fill DDLB with payload templates that match to the selected event
    this.payloadTemplateList = this.completePayloadTemplateList.filter( element => element.name === event );

    // TODO : How to Reset the selected payload template
    // As a workaround, add an empty element at the beginning
    this.payloadTemplateList.unshift({ name: '--empty--',
      description: '--empty--',
      payload: '',
      direction: 'SENT',
      customLoaded: false,
      id : uuid.v4()
    });
  }

  public onPayloadTemplateEventChanged(payloadTemplateId: string) {
    // find selected payload in list of templates and add it to the command
    const payloadTemplate = this.payloadTemplateList.find( element => element.id === payloadTemplateId);
    if (payloadTemplate) {
      this.cmdPayload = payloadTemplate.payload;
    }
  }

  public clearLog() {
    this.output = '';
    this.clearMsgDialog();
  }

  public writeLog(newLogLine: string) {
    this.output = this.output + newLogLine + '\r\n';
  }

  public runCmd() {
    this.clearMsgDialog();
    // make sure that the event can be sent, not only received
    if ( this.apiAllEventList.find( element => element.id === this.apiSentEvent && element.receiveOnly === true ) ) {
      this.openErrorDialog( MsgLevel.Error,
                            MsgLevel.Error,
                            'This event can only be received and not sent', [this.apiSentEvent]);
      return;
    }
    // Parse the payload input field and convert the string into an object
    let cmdPayloadObj = this.parsePayload(this.cmdPayload);
    if ((cmdPayloadObj || (cmdPayloadObj === '')) &&
      (this.apiSentEvent)) {
      try {
         this.shellSdk.emit(this.apiSentEvent, cmdPayloadObj);
         this.writeLog(`Sent event ${this.apiSentEvent} with specified payload`);
      } catch (ex) {
        let msgDetails = [];
        // check if this was a payload validation error that provides more details
        if (ex.name === 'PayloadValidationError') {
          msgDetails.push(ex.message);
          ex.detail?.forEach(element => {
            const detailMsg = element.dataPath ?
                    `Message: ${element.message}. keyword: ${element.keyword}. dataPath:${element.dataPath}` :
                    `Message: ${element.message}. keyword: ${element.keyword}`;
            msgDetails.push(detailMsg);
          });
        }
        this.openErrorDialog( MsgLevel.Error,
                              MsgLevel.Error,
                              'Event emit failed', msgDetails);
      }
    } else {
      this.openErrorDialog(MsgLevel.Info,
                           MsgLevel.Info,
                           'Please select an event from the drop down list box and provide the payload data in the input field', []);
    }
 }

  public runRegister() {
    this.clearMsgDialog();
    if (this.apiSentEvent) {
      const handler = new EventHander(this.apiSentEvent, this);
      this.eventHandler[this.apiSentEvent] = handler;


      const apiEvent = this.apiAllEventList.find( element => element.id === this.apiSentEvent);
      apiEvent.isRegistered = true;
      // check if we need a special kind of handler registration based on the event.
      switch (this.apiSentEvent) {
        case SHELL_EVENTS.Version1.SET_VIEW_STATE:
          // because you can specify multiple event handlers for different view states,
          // make sure that the register button stays enabled
          handler.isMultiHandlerEnabled = true;
          // Get the ViewState ID from the payload input window
          let viewState = this.cmdPayload;
          if (!viewState || viewState === '') {
             // this.writeLog('Use payload inputfield to specify the viewstate key you want to receive: ' + this.apiSentEvent) ;
             this.openErrorDialog( MsgLevel.Info,
                                   MsgLevel.Info,
                                   'Use payload inputfield to specify the viewstate key you want to receive',
                                   [this.apiSentEvent]);
          } else {
             // Need to get rid of the quotes characters around the viewstate string.
             const searchRegExp = /"/g;
             viewState = viewState.replace(searchRegExp, '');
             handler.setViewState(viewState);
             // tslint:disable-next-line
             // console.log(`register event handler for viewState ${viewState}`);
             this.shellSdk.onViewState(viewState, handler.handle.bind(handler));
          }
          break;

        default:
          // tslint:disable-next-line
          // console.log(`register event handler for shell event ${this.apiSentEvent}`);
          this.shellSdk.on(this.apiSentEvent, handler.handle.bind(handler));
          break;
      }
    } else {
      this.openErrorDialog(MsgLevel.Info,
                           MsgLevel.Info,
                           'Please select an event from the drop down list box', []);
    }
  }

  public runUnRegister() {
    this.clearMsgDialog();
    if (this.apiSentEvent && this.eventHandler[this.apiSentEvent]) {
      const handler = this.eventHandler[this.apiSentEvent];
      this.eventHandler[this.apiSentEvent] = null;
      // tslint:disable-next-line
      // console.log(`unregister event handler for shell event ${this.apiSentEvent}`);
      const apiEvent = this.apiAllEventList.find( element => element.id === this.apiSentEvent);
      apiEvent.isRegistered = false;
      this.shellSdk.off(this.apiSentEvent, handler.handle);
      // TODO : Check if unsubscripbe was successfull
    }
  }

  private clearMsgDialog() {
    this.displayError = {
      level: MsgLevel.Info,
      title: '',
      msg: '',
      details: []
    };
  }

  public openErrorDialog(level: MsgLevel, title: string, errorMsg: string, additionalData?: string[]) {

    this.displayError = { level: level,
                          title: title,
                          msg: errorMsg,
                          details: additionalData};

    // As long as Shell does not allow a backdrop for dialoges that are created by an extension
    // we can't use this dialog popup
    /*
    const modalRef = this.dialogService.open(ConfirmationComponent, {
      data: {
        title: title,
        message: errorMsg,
        additionalData: additionalData ? additionalData : [],
       // yesLabel: 'SHELL_LOGOUT_FAIL_DIALOG_YES_BTN',
        noLabel: 'close'
      },
      // backdropClass: 'dialog-custom-overlay-example'
      hasBackdrop: false
    } as any);

    modalRef.afterClosed.subscribe(
        result => {
          if (result !== null) {
              console.log("Dialog result : " + result);
          }
        }
      );
    */
  }

  public addImportedPayload(importedPayload: PayloadTemplate[]) {
    this.completePayloadTemplateList = this.completePayloadTemplateList.concat(importedPayload);
  }

  private parsePayload(payload: string): Object {
    let cmdPayloadObj = null;
    try {
      if (payload === '') {
        cmdPayloadObj = '';
      } else {
        cmdPayloadObj = JSON.parse(payload);
      }
    } catch (ex) {
      this.openErrorDialog(MsgLevel.Error,
                           MsgLevel.Error,
                           'JSON parser error during processing payload', [ex.message]);
      throw ex;
    }
    return cmdPayloadObj;
  }
}
