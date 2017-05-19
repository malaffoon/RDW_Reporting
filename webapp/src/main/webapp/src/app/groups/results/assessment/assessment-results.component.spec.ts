import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AssessmentResultsComponent } from "./assessment-results.component";
import { APP_BASE_HREF } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Component } from "@angular/core";
import { SharedModule } from "primeng/components/common/shared";
import { DataTableModule } from "primeng/components/datatable/datatable";

describe('AssessmentResultsComponent', () => {
  let component: AssessmentResultsComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), HttpModule, FormsModule, DataTableModule, SharedModule ],
      declarations: [ TestComponentWrapper, AssessmentResultsComponent ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;

    fixture.detectChanges();

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the first session', () => {
    let assessment = {
      sessions: [ { id: "ma-02", filter: undefined, exams: [] }, {
        id: "ma-04",
        filter: undefined,
        exams: []
      } ]
    };

    component.assessment = assessment;
    expect(assessment.sessions[ 0 ].filter).toBeTruthy();
    expect(assessment.sessions[ 1 ].filter).toBeFalsy();
  });

  it('should toggle sessions filtered to true and false', () => {
    let session = { id: "ma-02", filter: undefined, exams: [] };

    component.toggleSession(session);
    expect(session.filter).toBeTruthy();

    component.toggleSession(session);
    expect(session.filter).toBeFalsy();
  });

  it('should add/remove filtered sessions', () => {
    let session = { id: "ma-02", filter: undefined, exams: [ { name: "John Henderson" } ] };

    component.toggleSession(session);
    expect(component.examSessions[ 0 ].exam.name).toBe(session.exams[ 0 ].name)

    component.toggleSession(session);
    expect(component.examSessions.length).toBe(0);
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<assessment-results [assessment]="assessment"></assessment-results>'
})
class TestComponentWrapper {
  assessment = { sessions: [] }
}
