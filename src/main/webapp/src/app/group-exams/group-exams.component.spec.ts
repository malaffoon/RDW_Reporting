/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupExamsComponent} from "./group-exams.component";
import {BrowserModule} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {RouterModule} from "@angular/router";
import {HttpModule, Http} from "@angular/http";
import {DataService} from "../shared/data.service";

describe('GroupExamsComponent', () => {
  let component: GroupExamsComponent;
  let fixture: ComponentFixture<GroupExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupExamsComponent],
      imports: [BrowserModule, RouterModule, HttpModule, RouterTestingModule.withRoutes([])],
      providers: [DataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
