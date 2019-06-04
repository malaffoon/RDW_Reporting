import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '../../../../shared/common.module';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { TestModule } from '../../../../../test/test.module';
import { TranslateModule } from '@ngx-translate/core';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Assessment } from '../../../model/assessment';
import { TargetReportComponent } from './target-report.component';
import { GroupAssessmentService } from '../../../../groups/results/group-assessment.service';
import { AssessmentExamMapper } from '../../../assessment-exam.mapper';
import { ExamFilterService } from '../../../filters/exam-filters/exam-filter.service';
import { ExamStatisticsCalculator } from '../../exam-statistics-calculator';
import { ExamFilterOptionsService } from '../../../filters/exam-filters/exam-filter-options.service';
import { of } from 'rxjs';
import { DataTableService } from '../../../../shared/datatable/datatable-service';
import { TargetStatisticsCalculator } from '../../target-statistics-calculator';
import { SubgroupMapper } from '../../../../aggregate-report/subgroup/subgroup.mapper';
import { AggregateReportRequestMapper } from '../../../../aggregate-report/aggregate-report-request.mapper';
import { AggregateReportOrganizationService } from '../../../../aggregate-report/aggregate-report-organization.service';
import { AggregateReportService } from '../../../../aggregate-report/aggregate-report.service';
import { AssessmentService } from '../../../../aggregate-report/assessment/assessment.service';
import { ApplicationSettingsService } from '../../../../app-settings.service';
import { UserReportService } from '../../../../report/user-report.service';
import { TargetService } from '../../../../shared/target/target.service';

xdescribe('TargetReportComponent', () => {
  let component: TargetReportComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    let mockExamFilterService = {
      filterExams: () => []
    };

    let mockGroupAssessmentService = {
      getTargetScoreExams: (id: number) => of([])
    };

    let mockExamFilterOptionsService = {
      getExamFilterOptions: () => of({})
    };

    let mockApplicationSettingsService = {
      getSettings: () =>
        of({
          targetReport: {}
        })
    };

    let mockTargetService = {
      getTargetsForAssessment: () => of([])
    };

    let mockTargetStatisticsCalculator = {
      aggregateOverallScores: () => of([]),
      aggregateSubgroupScores: () => of([])
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), TestModule],
      declarations: [TargetReportComponent, TestComponentWrapper],
      providers: [
        {
          provide: ExamFilterService,
          useValue: mockExamFilterService
        },
        {
          provide: GroupAssessmentService,
          useValue: mockGroupAssessmentService
        },
        {
          provide: ExamFilterOptionsService,
          useValue: mockExamFilterOptionsService
        },
        {
          provide: ApplicationSettingsService,
          useValue: mockApplicationSettingsService
        },
        {
          provide: TargetService,
          useValue: mockTargetService
        },
        {
          provide: TargetStatisticsCalculator,
          useValue: mockTargetStatisticsCalculator
        },
        DataTableService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: `
    <target-report
      [assessment]="assessment"
      [assessmentProvider]="assessmentProvider"
      [subjectDefinition]="subjectDefinition"
    ></target-report>
  `
})
class TestComponentWrapper {
  assessment = {};
  assessmentProvider = {
    getTargetScoreExams: () => of([])
  };
  subjectDefinition = {
    performanceLevelStandardCutoff: 3
  };
}
