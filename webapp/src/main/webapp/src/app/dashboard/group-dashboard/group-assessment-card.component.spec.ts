import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupAssessmentCardComponent } from './group-assessment-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import {
  DetailsByPerformanceLevel,
  MeasuredAssessment
} from '../measured-assessment';
import { Assessment } from '../../assessments/model/assessment';
import { Group } from '../../groups/group';
import { ExamStatisticsCalculator } from '../../assessments/results/exam-statistics-calculator';

describe('GroupAssessmentCardComponent', () => {
  let component: GroupAssessmentCardComponent;
  let fixture: ComponentFixture<GroupAssessmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReportingCommonModule],
      declarations: [GroupAssessmentCardComponent],
      providers: [ExamStatisticsCalculator],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function createComponent() {
    fixture = TestBed.createComponent(GroupAssessmentCardComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    createComponent();
    const studentCountByPerformanceLevel: DetailsByPerformanceLevel[] = <
      DetailsByPerformanceLevel[]
    >[
      {
        percent: 20,
        studentCount: 2
      },
      {
        percent: 30,
        studentCount: 3
      },
      {
        percent: 50,
        studentCount: 5
      }
    ];
    const measuredAssessment = getMeasuredAssessment(
      studentCountByPerformanceLevel
    );
    component.card = {
      measuredAssessment,
      group: <Group>{
        id: 1,
        name: 'name',
        schoolId: 123,
        totalStudents: 10
      },
      performanceLevels: []
    };
    fixture.detectChanges();
    expect(component._dataWidths).toBeTruthy();
    expect(component._dataWidths).toEqual([20, 30, 50]);
  });

  it('should have percents of 33.33 have a data width sum to 100', () => {
    createComponent();
    const studentCountByPerformanceLevel: DetailsByPerformanceLevel[] = <
      DetailsByPerformanceLevel[]
    >[
      {
        percent: (1 / 3) * 100,
        studentCount: 1
      },
      {
        percent: (1 / 3) * 100,
        studentCount: 1
      },
      {
        percent: (1 / 3) * 100,
        studentCount: 1
      }
    ];
    const measuredAssessment = getMeasuredAssessment(
      studentCountByPerformanceLevel
    );
    component.card = {
      measuredAssessment,
      group: <Group>{
        id: 1,
        name: 'name',
        schoolId: 123,
        totalStudents: 3
      },
      performanceLevels: []
    };
    fixture.detectChanges();
    expect(component._percents).toEqual([33, 33, 33]);
    expect(component._dataWidths).toEqual([34, 33, 33]);
  });

  it('should have rounded percents sum of 101 and a data width sum to 100', () => {
    createComponent();
    const studentCountByPerformanceLevel = <DetailsByPerformanceLevel[]>[
      {
        percent: (2 / 7) * 100,
        studentCount: 2
      },
      {
        percent: (3 / 7) * 100,
        studentCount: 3
      },
      {
        percent: (2 / 7) * 100,
        studentCount: 2
      }
    ];
    const measuredAssessment = getMeasuredAssessment(
      studentCountByPerformanceLevel
    );
    component.card = {
      measuredAssessment,
      group: <Group>{
        id: 1,
        name: 'name',
        schoolId: 123,
        totalStudents: 7
      },
      performanceLevels: []
    };
    fixture.detectChanges();
    expect(component._percents).toEqual([29, 43, 29]);
    expect(component._dataWidths).toEqual([28, 43, 29]);
  });
});

function getAssessment(): Assessment {
  return <Assessment>{
    grade: '03',
    type: 'iab'
  };
}

function getMeasuredAssessment(
  studentCountByPerformanceLevel: DetailsByPerformanceLevel[]
): MeasuredAssessment {
  return <MeasuredAssessment>{
    assessment: getAssessment(),
    studentCountByPerformanceLevel: studentCountByPerformanceLevel,
    studentsTested: 10,
    date: new Date(),
    averageStandardError: 0,
    averageScaleScore: 0
  };
}
