import {OutputInterface} from './output-interface';

export class EventHander {

   private eventName: string;
   private outputLogger: OutputInterface;
   private viewState: string;
   public isMultiHandlerEnabled: boolean = false;

   constructor( eventName: string, outputLogger: OutputInterface) {
       this.eventName = eventName;
       this.outputLogger = outputLogger;
   }

   public handle(context: any, origin: string) {
    const payloadString = context ? JSON.stringify(context) : '--empty payload--';
    const originString = origin ? origin : '--empty origin--';
    let logString = '';
    if (this.viewState) {
       logString = `ViewState changed for ${this.viewState} from ${originString} including payload object: ${payloadString}`;
    } else {
       logString = `Received event ${this.eventName} from ${originString} including payload object: ${payloadString}`;
    }
    /* tslint:disable-next-line */
    console.log(logString);
    this.outputLogger.writeLog(logString);
   }

   public setViewState(viewState: string) {
       this.viewState = viewState;
   }

   public setMultiHandlerEnabled(flag: boolean) {
       this.isMultiHandlerEnabled = flag;
   }
}
