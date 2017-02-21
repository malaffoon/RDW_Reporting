/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {StudentExamsComponent} from "./student-exams.component";
import {BrowserModule} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {RouterModule} from "@angular/router";
import {HttpModule, Http} from "@angular/http";
import {DataService} from "../shared/data.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";

describe('StudentExamsComponent', () => {
  let component: StudentExamsComponent;
  let fixture: ComponentFixture<StudentExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentExamsComponent],
      imports: [BrowserModule, RouterModule, HttpModule, RouterTestingModule.withRoutes([])],
      providers: [DataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
