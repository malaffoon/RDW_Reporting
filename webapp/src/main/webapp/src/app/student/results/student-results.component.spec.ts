import { StudentResultsComponent } from './student-results.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { ActivatedRoute } from '@angular/router';
import { StudentExamHistory } from '../model/student-exam-history.model';
import { Student } from '../model/student.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StudentHistoryExamWrapper } from '../model/student-history-exam-wrapper.model';
import { Exam } from '../../assessments/model/exam';
import { Assessment } from '../../assessments/model/assessment';
import { MockRouter } from '../../../test/mock.router';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { Angulartics2 } from 'angulartics2';
import { ExamFilterService } from '../../assessments/filters/exam-filters/exam-filter.service';
import { of } from 'rxjs';
import { ApplicationSettingsService } from '../../app-settings.service';
import { MockUserService } from '../../../test/mock.user.service';
import { TestModule } from '../../../test/test.module';
import { ReportingEmbargoService } from '../../shared/embargo/reporting-embargo.service';
import { MockActivatedRoute } from '../../shared/test/mock.activated-route';
import { StudentResultsFilterService } from './student-results-filter.service';
import { ReportFormService } from '../../report/service/report-form.service';
import { ScaleScore } from '../../exam/model/scale-score';
import { SubjectService } from '../../subject/subject.service';
import { TranslateModule } from '@ngx-translate/core';

describe('StudentResultsComponent', () => {
  let component: StudentResultsComponent;
  let fixture: ComponentFixture<StudentResultsComponent>;
  let route: MockActivatedRoute;
  let router: MockRouter;
  let exportService: any;
  let embargoService: any;

  beforeEach(() => {
    exportService = {};
    embargoService = jasmine.createSpyObj('ReportingEmbargoService', {
      getEmbargo: of({})
    });

    const mockRouteSnapshot = {
      params: {},
      data: {
        examHistory: MockBuilder.history()
      }
    };

    const mockRoute = new MockActivatedRoute();

    const mockAngulartics2 = jasmine.createSpyObj<Angulartics2>(
      'angulartics2',
      ['eventTrack']
    );
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [
      'next'
    ]);

    const mockApplicationSettingsService = jasmine.createSpyObj(
      'ApplicationSettingsService',
      ['getSettings']
    );
    mockApplicationSettingsService.getSettings.and.callFake(() =>
      of({ minItemDataYear: 2016 })
    );

    const mockUserService = new MockUserService();

    router = new MockRouter();

    const mockSubjectService = jasmine.createSpyObj('SubjectService', [
      'getSubjectCodes',
      'getSubjectDefinitions'
    ]);
    mockSubjectService.getSubjectCodes.and.returnValue(of(['Math', 'ELA']));
    mockSubjectService.getSubjectDefinitions.and.returnValue(
      of([
        {
          subject: 'subject1',
          assessmentType: 'sum',
          performanceLevels: [1, 2, 3, 4],
          performanceLevelCount: 4,
          performanceLevelStandardCutoff: 3,
          scorableClaims: [],
          scorableClaimPerformanceLevelCount: null,
          scorableClaimPerformanceLevels: null,
          overallScore: {
            levels: [1, 2, 3, 4],
            levelCount: 4,
            standardCutoff: 3
          },
          alternateScore: {
            codes: ['a'],
            levels: [1],
            levelCount: 1
          }
        }
      ])
    );

    TestBed.configureTestingModule({
      imports: [ReportingCommonModule, TranslateModule.forRoot(), TestModule],
      declarations: [StudentResultsComponent],
      providers: [
        { provide: CsvExportService, useValue: exportService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        {
          provide: ApplicationSettingsService,
          useValue: mockApplicationSettingsService
        },
        { provide: ReportingEmbargoService, useValue: embargoService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: SubjectService, useValue: mockSubjectService },
        StudentResultsFilterService,
        ExamFilterService,
        { provide: ReportFormService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentResultsComponent);
    route = TestBed.get(ActivatedRoute);
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create without error when history is null', () => {
    const snapshot = route.snapshot;
    snapshot.data['examHistory'] = null;
    route.params.emit({ schoolYear: 2017 });

    expect(component).toBeTruthy();
  });

  /* Temporary Ignore */
  it('should filter by year on initialization', inject(
    [ActivatedRoute],
    (route: MockActivatedRoute) => {
      // Filter to the single 2017 exam
      route.params.emit({ historySchoolYear: 2017 });

      const filteredExams = component.sections.reduce((exams, section) => {
        exams.push(...section.filteredExams);
        return exams;
      }, []);

      const totalAssessmentTypes = filteredExams.reduce(
        (collection, exam) => collection.add(exam.assessment.type),
        new Set()
      ).size;

      const totalSubjects = filteredExams.reduce(
        (collection, exam) => collection.add(exam.assessment.subject),
        new Set()
      ).size;

      expect(totalAssessmentTypes).toBe(1);
      expect(totalSubjects).toBe(1);
    }
  ));

  it('should filter by subject on initialization', inject(
    [ActivatedRoute],
    (route: MockActivatedRoute) => {
      route.params.emit({ subject: 'MATH' });

      const filteredExams = component.sections.reduce((exams, section) => {
        exams.push(...section.filteredExams);
        return exams;
      }, []);

      filteredExams.forEach(exam => {
        expect(exam.assessment.subject).toBe('MATH');
      });
    }
  ));
});

class MockBuilder {
  private static assessmentIdx: number = 0;
  private static examIdx: number = 0;
  private static oddExam: boolean;

  static history(): StudentExamHistory {
    MockBuilder.assessmentIdx = 0;
    MockBuilder.examIdx = 0;
    MockBuilder.oddExam = false;

    const student: Student = new Student();
    student.id = 123;
    student.ssid = 'ssid';
    student.firstName = 'first';
    student.lastName = 'last';

    const exams: StudentHistoryExamWrapper[] = [];
    exams.push(MockBuilder.examWrapper('ica', 'MATH'));
    exams.push(MockBuilder.examWrapper('ica', 'ELA'));
    exams.push(MockBuilder.examWrapper('iab', 'MATH'));
    exams.push(MockBuilder.examWrapper('sum', 'ELA'));

    const history: StudentExamHistory = new StudentExamHistory();
    history.student = student;
    history.exams = exams;
    return history;
  }

  private static examWrapper(
    assessmentType: string,
    subject: string
  ): StudentHistoryExamWrapper {
    const wrapper: StudentHistoryExamWrapper = new StudentHistoryExamWrapper();
    wrapper.exam = MockBuilder.exam(assessmentType);
    wrapper.assessment = MockBuilder.assessment(assessmentType, subject);
    return wrapper;
  }

  private static exam(type: string): Exam {
    const exam: any = {};
    exam.date = new Date();
    exam.id = MockBuilder.examIdx++;
    exam.iep = false;
    exam.level = 3;
    exam.limitedEnglishProficiency = false;
    exam.migrantStatus = false;
    exam.plan504 = false;
    exam.score = 2594;
    exam.session = 'PRI-6888';
    exam.standardError = 52;

    // Give each exam an earlier year than the one before.
    exam.schoolYear = 2017 - exam.id;

    // toggle whether we're off-grade on each exam
    exam.enrolledGrade = MockBuilder.oddExam ? '04' : '05';

    // toggle completeness on each exam
    exam.completeness = MockBuilder.oddExam ? 'Partial' : 'Complete';

    MockBuilder.oddExam = !MockBuilder.oddExam;

    exam.claimScaleScores = [];
    if (type !== 'iab') {
      exam.claimScaleScores.push(MockBuilder.claimScore(1));
      exam.claimScaleScores.push(MockBuilder.claimScore(2));
    }

    exam.administrativeCondition = type === 'sum' ? 'Valid' : 'NS';

    return exam;
  }

  private static assessment(type: string, subject: string): Assessment {
    const assessment: any = {};
    assessment.grade = '05';
    assessment.id = MockBuilder.assessmentIdx++;
    assessment.label = 'Grade 5 ELA';
    assessment.subject = subject;
    assessment.type = type;

    assessment.claimCodes = [];
    if (type !== 'iab') {
      assessment.claimCodes.push('1');
      assessment.claimCodes.push('2-W');
    }

    return assessment;
  }

  private static claimScore(level: number): ScaleScore {
    return {
      level,
      score: 1234,
      standardError: 25
    };
  }
}
