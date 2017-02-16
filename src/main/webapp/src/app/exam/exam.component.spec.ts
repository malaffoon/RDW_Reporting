/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from "@angular/router";
import {ExamComponent} from "./exam.component";
import {Observable} from "rxjs/Rx";
import {HttpModule} from "@angular/http";
import {By} from "@angular/platform-browser";
import {Injectable} from "@angular/core";
import {DataService} from "../shared/data.service";

@Injectable()
class MockActivatedRoute extends ActivatedRoute {
  constructor(params) {
    super();
    this.params = Observable.of(params);
  }
}

@Injectable()
class MockDataService {
  getExam(id: string): Observable<Object> {
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
        {provide: DataService, useClass: MockDataService},
        {provide: ActivatedRoute, useValue: new MockActivatedRoute({examId: '5'})}
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
