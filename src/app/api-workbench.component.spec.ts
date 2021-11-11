import { TestBed, async } from '@angular/core/testing';
import { ApiWorkbench } from './api-workbench.component';

describe('ApiWorkbenchComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApiWorkbench
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ApiWorkbench);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });


});
