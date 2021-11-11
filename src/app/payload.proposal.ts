import { SHELL_EVENTS } from 'fsm-shell';

export class PayloadProposal {
   public event: string;
   public payload: string;
}

export const payloadProposalList: Array<PayloadProposal> = [
{ event: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
  payload: `{
    "clientIdentifier": string,
    "clientSecret": string,
    "cloudStorageKeys"?: CloudStorageKey[],
    "auth"?: {
      "response_type": 'token'
    }
  }`
},
{ event: SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION,
  payload: `{
    "response_type": 'token'
  }`
},
{ event: SHELL_EVENTS.Version2.GET_PERMISSIONS,
  payload: `{
    "objectName": string,
    "owners"?: string[]
  }`
},
{ event: SHELL_EVENTS.Version1.GET_PERMISSIONS,
  payload: `{
    "objectName": string,
    "owners"?: string[]
  }`
},
{ event: SHELL_EVENTS.Version1.GET_SETTINGS,
  payload: `"settingName": string`
},
{ event: SHELL_EVENTS.Version2.GET_STORAGE_ITEM,
  payload: `Key to read value from, type string`
},
{ event: SHELL_EVENTS.Version1.GET_STORAGE_ITEM,
  payload: `Key to read value from, type string`
},
{ event: SHELL_EVENTS.Version1.SET_STORAGE_ITEM,
  payload: `{
    "key": string,
    "value": T
  }`
},
{ event: SHELL_EVENTS.Version1.GET_FEATURE_FLAG,
  payload: `{
    "key": string,
    "defaultValue": boolean
  }`
},
{ event: SHELL_EVENTS.Version1.SET_TITLE,
  payload: `{
    "title": string
  }`
},
{ event: SHELL_EVENTS.Version1.RESTORE_TITLE,
  payload: `No request payload need to be provided`
},
{ event: SHELL_EVENTS.Version1.SET_VIEW_STATE,
  payload: `View state key`
},
{ event: SHELL_EVENTS.Version1.TO_APP,
  payload: `{
    "anydata": string,
    "anydata2": object
  }`
},
];
