/* tslint:disable:no-unused-variable */
import {TestBed, async} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {RouterTestingModule} from "@angular/router/testing";
import {StudentsComponent} from "./students/students.component";
import {ExamComponent} from "./exam/exam.component";
import {AssessmentService} from "./shared/exam.service";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StudentsComponent,
        ExamComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            redirectTo: '/students',
            pathMatch: 'full'
          },
          {
            path: 'students',
            component: StudentsComponent
          },
          {
            path: 'assessments/:assessmentId',
            component: ExamComponent
          }
        ])
      ],
      providers: [
        AssessmentService
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Reporting Client'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Reporting Client');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Reporting Client');
  }));
});
