import {OutputInterface} from './output-interface';
import {EventCollectorInterface} from './event-collector-interface';
import {ExportPayloadTemplate} from './model/payloadTemplate';

export class EventHander {

   private eventName: string;
   private outputLogger: OutputInterface;
   private viewState: string;
   private eventCollector: EventCollectorInterface;
   public isMultiHandlerEnabled: boolean = false;
   public regReference: any = undefined;

   constructor( eventName: string, outputLogger: OutputInterface, eventCollector: EventCollectorInterface ) {
       this.eventName = eventName;
       this.outputLogger = outputLogger;
       this.eventCollector = eventCollector;
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

        // add the received event to the event collection
        const event: ExportPayloadTemplate = {
            name: this.eventName,
            description: this.eventName + '_' + Date.now(),
            payload: context ? context : '""',
            direction: 'RECEIVED',
        };
        this.eventCollector.addEventToCollection(event);
    }

   public setViewState(viewState: string) {
       this.viewState = viewState;
   }

   public setMultiHandlerEnabled(flag: boolean) {
       this.isMultiHandlerEnabled = flag;
   }
}
