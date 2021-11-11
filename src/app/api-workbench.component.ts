import { Component } from '@angular/core';
import { ShellSdk, SHELL_EVENTS } from 'fsm-shell';
import { PayloadProposal, payloadProposalList } from './payload.proposal';
import { EventHander } from './event-hander';
import { Event } from './model/event';
import { OutputInterface } from './output-interface';

@Component({
  selector: 'api-workbench-root',
  templateUrl: './api-workbench.component.html',
  styleUrls: ['./api-workbench.component.scss']
})
export class ApiWorkbench implements OutputInterface {
  public output : string = '';
  public cmdPayload : string = '';
  public apiSentEvent : string = '';
  public apiSentEventList: Event[] = new Array();
  public apiReceiveOnlyEventList: Event[] = new Array();
  public apiAllEventList: Event[] = new Array();
  public eventHandler: EventHander[] = new Array();
  private shellSdk: ShellSdk;

  public ngOnInit() {
    this.apiReceiveOnlyEventList.push( {id: SHELL_EVENTS.ERROR, name: SHELL_EVENTS.ERROR, receiveOnly: true, isRegistered: false})

    let eventsV1 = Object.keys(SHELL_EVENTS.Version1);
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
    this.apiAllEventList = this.apiSentEventList.concat(this.apiReceiveOnlyEventList);

    this.cmdPayload = '';

    console.log('using ShellSdk version', ShellSdk.VERSION);
    if (!ShellSdk.isInsideShell()) {
      throw new Error('unable to reach shell eventAPI');
    }

    this.shellSdk = ShellSdk.init(parent, '*');

  }

  public onApiEventChanged(event: string){
    console.log(event);
    const eventPayloadProposal = payloadProposalList.find( payload => payload.event === event)
    eventPayloadProposal ? this.cmdPayload = eventPayloadProposal.payload : this.cmdPayload = '';
  }

  public clearLog(){
    this.output = '';
  }

  public writeLog(newLogLine : string){
    this.output = this.output + newLogLine + '\r\n';
  }

  public runCmd(){
    let cmdPayloadObj = null;
    try {
      if (this.cmdPayload === '') {
        cmdPayloadObj = ''
      }
      else {
        cmdPayloadObj = JSON.parse(this.cmdPayload);
      }
    }
    catch (ex) {
      console.error('JSON parser error during processing payload : ' + ex);
    }

    // make sure that the event can be sent, not only received
    if ( this.apiReceiveOnlyEventList.find( element => element.id === this.apiSentEvent) ){
      console.error('This event can only be received, not sent: ' + this.apiSentEvent );
      this.writeLog('This event can only be received, not sent: ' + this.apiSentEvent) ;
      return;
    }

    if (cmdPayloadObj && this.apiSentEvent) {
      console.log(`fire shell event ${this.apiSentEvent} with payload : ${this.cmdPayload}`);
      this.shellSdk.emit(this.apiSentEvent, cmdPayloadObj);
    }

 }

  public runRegister() {
    if (this.apiSentEvent) {
      const handler = new EventHander(this.apiSentEvent, this);
      this.eventHandler[this.apiSentEvent] = handler;
      console.log(`register event handler for shell event ${this.apiSentEvent}`);
      /*
      this.shellSdk.on(this.apiSentEvent, async (event) => {
        console.log(`received event ${event.type} including payload ${event.payload}`)
      } );
      */
      const apiEvent = this.apiAllEventList.find( element => element.id === this.apiSentEvent);
      apiEvent.isRegistered = true;
      this.shellSdk.on(this.apiSentEvent, handler.handle.bind(handler));
    }
  }

  public runUnRegister() {
    if (this.apiSentEvent && this.eventHandler[this.apiSentEvent]) {
      const handler = this.eventHandler[this.apiSentEvent];
      this.eventHandler[this.apiSentEvent] = null;
      console.log(`unregister event handler for shell event ${this.apiSentEvent}`);
      const apiEvent = this.apiAllEventList.find( element => element.id === this.apiSentEvent);
      apiEvent.isRegistered = false;
      this.shellSdk.off(this.apiSentEvent, handler.handle);

      // UNSUBSCRIBE FUNZT NICHT!!!
      // UNSUBSCRIBE FUNZT NICHT!!!
      // UNSUBSCRIBE FUNZT NICHT!!!
    }
  }

  // TODO :
  // Payload Proposal based on Event Type
  // Enable/Disable Payload Proposal
  // Display Errors on UI
  // Result Logging UI element
  // Clear result UI element
  // Show in API list which Event has a registration

}
