import { Component, Output, EventEmitter } from '@angular/core';
import { PayloadTemplate } from '../../model/payloadTemplate';
import * as uuid from 'uuid';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent {
    @Output() public onImportPayload = new EventEmitter();

    public fileChange(event: any): void {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file = fileList[0] as any;

            file.text().then((value: string) => {
                try {
                    const payloadFromUpload = JSON.parse(value);
                    // Upload needs to contain 'shellApiWorkbenchData' as an Array
                    if ((!payloadFromUpload.shellApiWorkbenchData) ||
                        (!Array.isArray(payloadFromUpload.shellApiWorkbenchData))) {
                        // Upload data does not have the required structure
                        // Inform User about error
                        // tslint:disable-next-line
                        console.log('Upload data does not have the required structure');
                    }
                    const dataArray: PayloadTemplate[] = payloadFromUpload.shellApiWorkbenchData;
                    const newPayloadDataList = [];

                    dataArray.forEach(element => {
                        // check direction. Only import data that has been sent
                        if (element.direction === 'SENT') {
                            const newPayload: PayloadTemplate = {
                                id: uuid.v4(),
                                name: element.name,
                                description: element.description,
                                payload: element.payload,
                                direction: element.direction,
                                customLoaded: true
                            };
                            newPayloadDataList.push(newPayload);
                        }
                    });
                    // tslint:disable-next-line
                    console.log(`Added ${newPayloadDataList.length} Payloads to the list`);
                    this.onImportPayload.emit(newPayloadDataList);
                } catch (ex) {
                    // tslint:disable-next-line
                    console.log('Error during parsing payload file:' + ex);
                }
            });
        }
    }
}
