/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from "@angular/router";
import {AssessmentComponent} from "./assessment.component";
import {Observable} from "rxjs/Rx";
import {AssessmentService} from "../shared/assessment.service";
import {HttpModule} from "@angular/http";
import {By} from "@angular/platform-browser";
import {Injectable} from "@angular/core";

@Injectable()
class MockActivatedRoute extends ActivatedRoute {
  constructor(params) {
    super();
    this.params = Observable.of(params);
  }
}

@Injectable()
class MockAssessmentService {
  getAssessment(id: string): Observable<Object> {
    return Observable.of({id: id});
  }
}

describe('AssessmentComponent', () => {
  let component: AssessmentComponent;
  let fixture: ComponentFixture<AssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      declarations: [
        AssessmentComponent
      ],
      providers: [
        {provide: AssessmentService, useClass: MockAssessmentService},
        {provide: ActivatedRoute, useValue: new MockActivatedRoute({assessmentId: '5'})}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect assessment specified in URI parameters', () => {
    expect(fixture.debugElement.query(By.css('p')).nativeElement.textContent).toContain('Assessment 5');
  })

});
