import { async, TestBed } from '@angular/core/testing';
import { Observable, Observer, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AssessmentsComponent } from './assessments.component';
import { Exam } from './model/exam';
import { ExamFilterOptionsService } from './filters/exam-filters/exam-filter-options.service';
import { GroupAssessmentService } from '../groups/results/group-assessment.service';
import { Assessment } from './model/assessment';
import { AssessmentExam } from './model/assessment-exam.model';
import { ExamFilterOptions } from './model/exam-filter-options.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '../shared/common.module';
import { Angulartics2 } from 'angulartics2';
import { MockUserService } from '../../test/mock.user.service';
import { ApplicationSettingsService } from '../app-settings.service';
import { UserService } from '../shared/security/service/user.service';

function assessmentExam(): AssessmentExam {
  return {
    assessment: <Assessment>{},
    exams: []
  };
}

let examObserver: Observer<Exam[]>;
describe('AssessmentsComponent', () => {
  let component: AssessmentsComponent;
  let fixture;
  let mockRouteSnapshot;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [
    'eventTrack'
  ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

  const settings: any = {};
  const mockApplicationSettingsService = jasmine.createSpyObj(
    'ApplicationSettingsService',
    ['getSettings']
  );
  mockApplicationSettingsService.getSettings.and.callFake(() => of(settings));

  beforeEach(async(() => {
    mockRouteSnapshot = getRouteSnapshot();
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [AssessmentsComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: { snapshot: mockRouteSnapshot } },
        {
          provide: ExamFilterOptionsService,
          useClass: MockExamFilterOptionsService
        },
        { provide: GroupAssessmentService, useClass: MockAssessmentService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        {
          provide: ApplicationSettingsService,
          useValue: mockApplicationSettingsService
        },
        { provide: UserService, useValue: new MockUserService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(done => {
    fixture = TestBed.createComponent(AssessmentsComponent);
    component = fixture.componentInstance;
    component.assessmentExams = [assessmentExam(), assessmentExam()];
    component.assessmentProvider = new MockAssessmentService() as any;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      done();
    });
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load assessment exams when selected assessments changed', () => {
    let assessment = <Assessment>{
      id: 54,
      selected: true
    };

    component.showOnlyMostRecent = false;
    component.availableAssessments = [assessment];
    component.selectedAssessmentsChanged(assessment);

    // Return mock api result.
    examObserver.next(<Exam[]>[{}, {}, {}]);

    let actual = component.assessmentExams;
    expect(actual.length).toBe(1);
    expect(actual[0].assessment.id).toBe(assessment.id);
    expect(actual[0].exams.length).toBe(3);
  });

  it('should remove assessment exams when selected assessments changed', () => {
    const assessment = <Assessment>{
      id: 54
    };

    const assessmentExam = {
      assessment,
      exams: <Exam[]>[{}, {}]
    };

    component.showOnlyMostRecent = false;
    component.availableAssessments = [assessment];
    component.assessmentExams = [assessmentExam];

    component.selectedAssessmentsChanged(assessment);
    let actual = component.assessmentExams;

    expect(actual.length).toBe(0);
  });
});

function getRouteSnapshot() {
  return {
    data: {},
    params: {
      groupId: 2
    }
  };
}

class MockExamFilterOptionsService {
  public getExamFilterOptions() {
    const result = new ExamFilterOptions();
    result.schoolYears = [2009, 2008, 2007, 2006, 2005];
    result.ethnicities = [
      'AmericanIndianOrAlaskaNative',
      'Asian',
      'BlackOrAfricanAmerican'
    ];
    return of(result);
  }
}

class MockAssessmentService {
  public getAvailableAssessments() {
    return of([]);
  }

  public getExams() {
    return new Observable<Exam[]>(observer => (examObserver = observer));
  }
}
