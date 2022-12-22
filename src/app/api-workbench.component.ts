import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ShellSdk, SHELL_EVENTS } from 'fsm-shell';
import { payloadProposalList } from './payload.proposal';
import { payloadTemplateList } from './payload-template-list';
import { EventHander } from './event-hander';
import { Event } from './model/event';
import { OutputInterface } from './output-interface';
import { EventCollectorInterface } from './event-collector-interface';
import { ShellPayloadValidationService } from './services/shell-payload-validation.service';
import { ErrorMsg, MsgLevel } from './model/errorMsg';
import { PayloadTemplate, ExportPayloadTemplate } from './model/payloadTemplate';
import { SHELL_API_WORKBENCH_VERSION_INFO } from '../ShellApiWorkbenchVersionInfo';
import * as uuid from 'uuid';

// import { ConfirmationComponent } from './components/confirmation/confirmation.component';
// import { DialogService } from '@fundamental-ngx/core';
@Component({
  selector: 'api-workbench-root',
  templateUrl: './api-workbench.component.html',
  styleUrls: ['./api-workbench.component.scss']
})
export class ApiWorkbench implements OutputInterface, EventCollectorInterface {
  public output: string = '';
  public cmdPayload: string = '';
  public apiSentEvent: string = '';
  public includeReceivedEvents: boolean = false;
  public apiSentEventList: Event[] = new Array();
  public apiAdditionalEventList: Event[] = new Array();
  public apiReceiveOnlyEventList: string[] = new Array();
  public apiDeprecatedEventList: string[] = new Array();
  public apiAllEventList: Event[] = new Array();
  public eventHandler: EventHander[] = new Array();
  public displayError: ErrorMsg;
  public payloadTemplate: any;
  public payloadTemplateList: PayloadTemplate[];
  private shellSdk: ShellSdk;
  private completePayloadTemplateList: PayloadTemplate[];

  private eventCollector: ExportPayloadTemplate[] = new Array();

  private urlParamRunEventOnStart = 'EventOnStart';

  constructor(
    private shellPayloadValidationService: ShellPayloadValidationService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit() {
    this.clearMsgDialog();

    // tslint:disable-next-line
    console.log(`Shell API Workbench version : ${SHELL_API_WORKBENCH_VERSION_INFO.VERSION}, ${SHELL_API_WORKBENCH_VERSION_INFO.BUILD_TS}`);

    this.apiAdditionalEventList.push({ id: SHELL_EVENTS.ERROR, name: SHELL_EVENTS.ERROR, receiveOnly: true, isRegistered: false });

    this.apiReceiveOnlyEventList.push(SHELL_EVENTS.Version1.SET_VIEW_STATE,
      SHELL_EVENTS.ERROR);

    this.apiDeprecatedEventList.push(SHELL_EVENTS.Version1.GET_STORAGE_ITEM,
      SHELL_EVENTS.Version1.GET_PERMISSIONS);

    let eventsV1 = Object.keys(SHELL_EVENTS.Version1);
    // filter PRIVATE, OUTLET, MODAL, CLOSE, REQUIRE_PERMISSIONS Events
    eventsV1 = eventsV1.filter(eventName => (eventName !== 'PRIVATE') &&
      (eventName !== 'OUTLET') &&
      (eventName !== 'MODAL') &&
      (eventName !== 'REQUIRE_PERMISSIONS') &&
      (eventName !== 'CLOSE'));

    let eventsV2 = Object.keys(SHELL_EVENTS.Version2);

    eventsV1.forEach(apiEvent => {
      const eventName = 'V1.' + apiEvent;
      this.apiSentEventList.push({ id: eventName, name: eventName, receiveOnly: false, isRegistered: false });
    });

    eventsV2.forEach(apiEvent => {
      const eventName = 'V2.' + apiEvent;
      this.apiSentEventList.push({ id: eventName, name: eventName, receiveOnly: false, isRegistered: false });
    });

    // combine list of all events
    this.apiAllEventList = this.apiSentEventList.concat(this.apiAdditionalEventList);

    // remove deprecated events
    this.apiDeprecatedEventList.forEach(element => {
      const index = this.apiAllEventList.findIndex(searchElement => searchElement.name === element);
      if (index >= 0) {
        this.apiAllEventList.splice(index, 1);
      }
    });

    // mark the events that can't be sent, but only received
    this.apiReceiveOnlyEventList.forEach(element => {
      let apiEvent = this.apiAllEventList.find(event => event.id === element);
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

    /*
    this.route.params.subscribe(params => {
      console.log('inside route parameter subscriber');
      // In a real app: dispatch action to load the details here.
   });
   */

    // Check if we got a URL parameter to start an event directly
//    this.route.queryParamMap.subscribe((params) => {
      this.route.params.subscribe(params => {
      const urlParam = params[this.urlParamRunEventOnStart];
      console.log('inside parameter subscriber');
      if (urlParam !== undefined) {
        console.log('parameter ' + urlParam);
        // check if we found the event name in the list of events,
        // otherwise use fallback GetContext
        let startEvent = this.apiAllEventList.find(eventElement => { eventElement.id === urlParam })
        let startEventName :string;
        let startEventPayload :PayloadTemplate;
        if (startEvent !== undefined) {
          startEventName = startEvent.id;
          startEventPayload = this.completePayloadTemplateList.find(element => element.name === startEventName);
        } else {
          startEventName = SHELL_EVENTS.Version1.REQUIRE_CONTEXT;
          startEventPayload = this.completePayloadTemplateList.find(element => element.name === SHELL_EVENTS.Version1.REQUIRE_CONTEXT);
        }
        // register event handler for the provided event name
        this.apiSentEvent = startEventName;
        this.runRegister();
        this.cmdPayload = startEventPayload.payload;
        this.runCmd();
      }
    }
    );

  }

  public onApiEventChanged(event: string) {
    const eventPayloadProposal = payloadProposalList.find(payload => payload.event === event);
    eventPayloadProposal ? this.cmdPayload = eventPayloadProposal.payload : this.cmdPayload = '';

    // Fill DDLB with payload templates that match to the selected event
    this.payloadTemplateList = this.completePayloadTemplateList.filter(element => element.name === event);

    // TODO : How to Reset the selected payload template
    // As a workaround, add an empty element at the beginning
    this.payloadTemplateList.unshift({
      name: '--empty--',
      description: '--empty--',
      payload: '',
      direction: 'SENT',
      customLoaded: false,
      id: uuid.v4()
    });
  }

  public onPayloadTemplateEventChanged(payloadTemplateId: string) {
    // find selected payload in list of templates and add it to the command
    const selectedPayloadTemplate = this.payloadTemplateList.find(element => element.id === payloadTemplateId);
    if (selectedPayloadTemplate) {
      this.cmdPayload = selectedPayloadTemplate.payload;
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
    if (this.apiAllEventList.find(element => element.id === this.apiSentEvent && element.receiveOnly === true)) {
      this.openErrorDialog(MsgLevel.Error,
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
        // add the sent event to the event collection for later export
        const sentEvent: ExportPayloadTemplate = {
          name: this.apiSentEvent,
          description: this.apiSentEvent + '_' + Date.now(),
          payload: JSON.stringify(cmdPayloadObj),
          direction: 'SENT'
        };
        this.eventCollector.push(sentEvent);
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
        this.openErrorDialog(MsgLevel.Error,
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
      const handler = new EventHander(this.apiSentEvent, this, this);
      // store the reference that was created using bind.
      // Otherwise it's not possible to perform unregistration cause function comparison fails
      handler.regReference = handler.handle.bind(handler);
      this.eventHandler[this.apiSentEvent] = handler;

      const apiEvent = this.apiAllEventList.find(element => element.id === this.apiSentEvent);
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
            this.openErrorDialog(MsgLevel.Info,
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
            this.shellSdk.onViewState(viewState, handler.regReference);
          }
          break;

        default:
          // tslint:disable-next-line
          // console.log(`register event handler for shell event ${this.apiSentEvent}`);
          this.shellSdk.on(this.apiSentEvent, handler.regReference);
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
      const apiEvent = this.apiAllEventList.find(element => element.id === this.apiSentEvent);
      apiEvent.isRegistered = false;
      this.shellSdk.off(this.apiSentEvent, handler.regReference);
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

    this.displayError = {
      level: level,
      title: title,
      msg: errorMsg,
      details: additionalData
    };

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

  public addEventToCollection(newEvent: ExportPayloadTemplate) {
    this.eventCollector.push(newEvent);
  }

  public exportEvents() {
    let summary: string = '=========EXPORT START=========\r\n{\r\n "shellApiWorkbenchData" : \r\n';

    let payloadString = '';
    // check if we need to exclude the received events
    if (this.includeReceivedEvents) {
      payloadString = JSON.stringify(this.eventCollector);
    } else {
      const filteredList = this.eventCollector.filter(element => element.direction === 'SENT');
      payloadString = JSON.stringify(filteredList);
    }

    // Add some line breaks so that the events are separated
    // tslint:disable-next-line
    summary = summary + payloadString.replace(/},{/g, '},\r\n{');

    summary = summary + '\r\n }\r\n==========EXPORT END==========\r\n';
    this.writeLog(summary);
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
