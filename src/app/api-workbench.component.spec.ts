import { TestBed, async } from '@angular/core/testing';
import { ApiWorkbench } from './api-workbench.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FileUploadComponent } from './components/fileUpload/file-upload.component';
import { ShellPayloadValidationService} from './services/shell-payload-validation.service';

describe('ApiWorkbenchComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApiWorkbench,
        ConfirmationComponent,
        ErrorMessageComponent,
        FileUploadComponent
      ],
      providers: [
        ShellPayloadValidationService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ApiWorkbench);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });


});
