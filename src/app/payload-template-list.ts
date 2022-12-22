import { SHELL_EVENTS } from 'fsm-shell';
import { PayloadTemplate } from './model/payloadTemplate';
import * as uuid from 'uuid';

export const payloadTemplateList: Array<PayloadTemplate> = [
{ name: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
  description: 'example: require context',
  payload: `{
    "clientIdentifier": "ABC",
    "clientSecret": "123"
  }`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.GET_FEATURE_FLAG,
  description: 'example: get feature flag',
  payload: `{
    "key": "feature-flag-key",
    "defaultValue": false
  }`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.SET_TITLE,
  description: 'example: set title',
  payload: `{
    "title": "Title set via Extension"
  }`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION,
  description: 'example: require authentication',
  payload: `{
    "response_type": "token"
  }`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version2.GET_PERMISSIONS,
  description: 'example: get permission',
  payload: `{
    "objectName": "ACTIVITY",
    "owners": ["1","2"]
  }`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.GET_SETTINGS,
  description: 'example: get settings',
  payload: `"userPerson"`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version2.GET_STORAGE_ITEM,
  description: 'example: get storage item',
  payload: `"Cockpit_SelectedLocale"`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.SET_STORAGE_ITEM,
  description: 'example: set storage item',
  payload: `{
    "key": "Cockpit_SelectedLocale",
    "value": "de"
  }`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.RESTORE_TITLE,
  description: 'example: restore title',
  payload: ``,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.SET_VIEW_STATE,
  description: 'example: register for view state',
  payload: `TECHNICIAN`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
{ name: SHELL_EVENTS.Version1.TO_APP,
  description: 'example: to app',
  payload: `"unselect"`,
  direction: 'SENT',
  customLoaded: false,
  id : uuid.v4()
},
];
