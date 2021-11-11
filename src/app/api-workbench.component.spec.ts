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

  it(`should have as title 'ShellApiTester'`, () => {
    const fixture = TestBed.createComponent(ApiWorkbench);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ShellApiTester');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(ApiWorkbench);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ShellApiTester!');
  });
});
