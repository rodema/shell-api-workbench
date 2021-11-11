import {OutputInterface} from './output-interface';

export class EventHander{

   private eventName: string;
   private outputLogger: OutputInterface;
   constructor( eventName: string, outputLogger: OutputInterface){
       this.eventName = eventName;
       this.outputLogger = outputLogger;
   }

   public handle(context, origin){
    const payloadString = context ? JSON.stringify(context) : '--empty payload--';
    const originString = origin ? origin : '--empty origin--';
    const logString = `received event ${this.eventName} from ${originString} including payload object: ${payloadString}`;
    console.log(logString);
    this.outputLogger.writeLog(logString);
   }

}