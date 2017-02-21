/* tslint:disable:no-unused-variable */
import {TestBed, async} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {RouterTestingModule} from "@angular/router/testing";
import {StudentsComponent} from "./students/students.component";
import {ExamComponent} from "./exam/exam.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule, Http} from "@angular/http";
import {DataService} from "./shared/data.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {ExamsComponent} from "./student-exams/student-exams.component";
import {GroupsComponent} from "./groups/groups.component";
import {PadStartPipe} from "./shared/pad-start.pipe";
import {Observable} from "rxjs";
import {routes} from "./shared/routes";

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PadStartPipe,
        AppComponent,
        ExamComponent,
        StudentsComponent,
        GroupsComponent,
        ExamsComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterTestingModule.withRoutes(routes),
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
          deps: [Http]
        })
      ],
      providers: [
        DataService
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
