import {ExportPayloadTemplate} from './model/payloadTemplate';

export interface EventCollectorInterface {
   addEventToCollection(newEvent: ExportPayloadTemplate);
}
