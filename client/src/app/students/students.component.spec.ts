/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {StudentsComponent} from "./students.component";
import {RouterModule} from "@angular/router";
import {DataService} from "../shared/data.service";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsComponent],
      imports: [BrowserModule, RouterModule, HttpModule, RouterTestingModule.withRoutes([])],
      providers: [DataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
