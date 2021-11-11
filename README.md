# ShellApiWorkbench
The Shell API workbench offers you an interactive way to test the individual events that are used to communicate between the shell, the client application and the extension.
With the event drop down list box, you can select the event which you want to sent.
The payload input field box which shows the structure of the required payload can be used to enter the event payload.

The Emit Event button will sent the selected event including the payload.
In case you want to see the "result" which is sent back you need to press the "Register Eventhandler" button before you sent an event.
This will register an handler for the current selected event. The handler will print the received event including the data to the event log.


## Upload example payload
You can upload a file with event payload that can be used in the workbench to populate the payload input field.
The name must match to the event name which can be selected in the event drop down list box.
The imported payload will show up in the payload template drop down list box with the description text
as soon as the corresponding event was selected from the event drop down list box.
If there is no payload template available for an selected event, the payload template drow down list box will stay empty.
Only events of direction "SENT" will be imported.

### Example file

```
{
"shellApiWorkbenchData" : [
{
    "name": "V1.SET_TITLE",
    "description": "set title hello",
    "payload": "{ \"title\": \"hello\" }",
    "direction": "SENT"		  
},
{
    "name": "V1.SET_TITLE",
    "description": "set title world",
    "payload": "{ \"title\": \"world\" }",
    "direction": "SENT"		  
},
  {
    "name": "V1.GET_FEATURE_FLAG",
    "description": "get feature flag geocoding",
    "payload": "{\"key\": \"api-key-authentication-for-geocoding-cpb-33398\", \"defaultValue\": false } ",
    "direction": "SENT"		  
}  
]
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
