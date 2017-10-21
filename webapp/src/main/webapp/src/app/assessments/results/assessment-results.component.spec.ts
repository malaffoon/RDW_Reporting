import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AssessmentResultsComponent } from "./assessment-results.component";
import { APP_BASE_HREF } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Component, EventEmitter } from "@angular/core";
import { SharedModule } from "primeng/components/common/shared";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { ScaleScoreComponent } from "./scale-score.component";
import { AverageScaleScoreComponent } from "./average-scale-score.component";
import { ItemViewerComponent } from "../items/item-viewer/item-viewer.component";
import { ItemTabComponent } from "../items/item-tab.component";
import { PopoverModule, TabsModule } from "ngx-bootstrap";
import { Student } from "../../student/model/student.model";
import { PopupMenuComponent } from "../menu/popup-menu.component";
import { ColorService } from "../../shared/color.service";
import { Angulartics2, Angulartics2Module } from "angulartics2";
import { ItemExemplarComponent } from "../items/item-exemplar/item-exemplar.component";
import { ItemScoresComponent } from "../items/item-scores/item-scores.component";
import { TestModule } from "../../../test/test.module";
import { ItemInfoComponent } from "../items/item-info/item-info.component";
import { ScaleScoreService } from "../../shared/scale-score.service";
import { MockDataService } from "../../../test/mock.data.service";
import { DataService } from "../../shared/data/data.service";
import { NotificationService } from "../../shared/notification/notification.service";
import { Notification } from "../../shared/notification/notification.model";
import { ItemInfoService } from "../items/item-info/item-info.service";
import { UserService } from "../../user/user.service";
import { UserMapper } from "../../user/user.mapper";
import { CachingDataService } from "../../shared/cachingData.service";
import { ClaimTargetComponent } from "./claim-target.component";
import { ReportModule } from "../../report/report.module";
import { CommonModule } from "../../shared/common.module";
import { ResultsByStudentComponent } from "./view/results-by-student/results-by-student.component";

describe('AssessmentResultsComponent', () => {
  let component: AssessmentResultsComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;
  let dataService: MockDataService;
  let service: MockNotificationService;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

  beforeEach(async(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DataTableModule,
        FormsModule,
        HttpModule,
        PopoverModule.forRoot(),
        SharedModule,
        CommonModule,
        ReportModule,
        TabsModule,
        TranslateModule.forRoot(),
        Angulartics2Module,
        TestModule
      ],
      declarations: [
        AssessmentResultsComponent,
        ItemTabComponent,
        ItemViewerComponent,
        ItemInfoComponent,
        ItemExemplarComponent,
        ItemScoresComponent,
        PopupMenuComponent,
        ScaleScoreComponent,
        AverageScaleScoreComponent,
        TestComponentWrapper,
        ClaimTargetComponent,
        ResultsByStudentComponent
      ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        ExamStatisticsCalculator,
        ExamFilterService,
        ColorService,
        ScaleScoreService,
        { provide: DataService, useValue: dataService },
        { provide: NotificationService, useValue: service },
        ItemInfoService,
        UserService,
        UserMapper,
        { provide: CachingDataService, useValue: dataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the first session', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].filter).toBeTruthy();
    expect(component.sessions[ 1 ].filter).toBeFalsy();
  });

  it('should order by most recent', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-01-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].id).toBe("ma-01");
    expect(component.sessions[ 1 ].id).toBe("ma-02");
  });

  it('should toggle sessions filtered to true and false', () => {
    let session = { id: "ma-02", filter: undefined, exams: [] };

    component.toggleSession(session);
    expect(session.filter).toBeTruthy();

    component.toggleSession(session);
    expect(session.filter).toBeFalsy();
  });

  it('should add/remove filtered sessions', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    component.toggleSession(component.sessions[ 1 ]);
    expect(component.exams.length).toBe(2);

    component.toggleSession(component.sessions[ 1 ]);
    expect(component.exams.length).toBe(1);

    component.toggleSession(component.sessions[ 0 ]);
    expect(component.exams.length).toBe(0);
  });

  function buildExam(studentName: string, session: string, date: any) {
    let exam = new Exam();
    exam.student = new Student();
    exam.student.lastName = studentName;
    exam.session = session;
    exam.date = date;

    return exam;
  }
});

@Component({
  selector: 'test-component-wrapper',
  template: '<assessment-results [assessmentExam]="assessment"></assessment-results>'
})
class TestComponentWrapper {
  assessment = new AssessmentExam();
}

class MockNotificationService {
  onNotification: EventEmitter<Notification> = new EventEmitter();
}
