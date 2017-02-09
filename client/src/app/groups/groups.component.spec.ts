/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupsComponent} from "./groups.component";
import {DataService} from "../shared/data.service";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";
import {RouterTestingModule} from "@angular/router/testing";

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsComponent],
      imports: [BrowserModule, RouterModule, HttpModule, RouterTestingModule.withRoutes([])],
      providers: [DataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
