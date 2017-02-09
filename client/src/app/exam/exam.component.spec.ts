/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from "@angular/router";
import {ExamComponent} from "./exam.component";
import {Observable} from "rxjs/Rx";
import {AssessmentService} from "../shared/exam.service";
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

describe('ExamComponent', () => {
  let component: ExamComponent;
  let fixture: ComponentFixture<ExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      declarations: [
        ExamComponent
      ],
      providers: [
        {provide: AssessmentService, useClass: MockAssessmentService},
        {provide: ActivatedRoute, useValue: new MockActivatedRoute({assessmentId: '5'})}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect exam specified in URI parameters', () => {
    expect(fixture.debugElement.query(By.css('p')).nativeElement.textContent).toContain('Exam 5');
  })

});
