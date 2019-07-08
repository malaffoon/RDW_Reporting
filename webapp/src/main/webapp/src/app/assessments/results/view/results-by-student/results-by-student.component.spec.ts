import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsByStudentComponent } from './results-by-student.component';
import { ReportingCommonModule } from '../../../../shared/reporting-common.module';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { TestModule } from '../../../../../test/test.module';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Assessment } from '../../../model/assessment';
import { InstructionalResourcesService } from '../../../../shared/service/instructional-resources.service';
import { CachingDataService } from '../../../../shared/data/caching-data.service';
import { of } from 'rxjs';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { OrderingService } from '../../../../shared/ordering/ordering.service';
import { ReportFormService } from '../../../../report/service/report-form.service';
import { SubjectDefinition } from '../../../../subject/subject';
import { TranslateModule } from '@ngx-translate/core';

describe('ResultsByStudentComponent', () => {
  let component: ResultsByStudentComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  const mockOrderingService = jasmine.createSpyObj('OrderingService', [
    'getScorableClaimOrdering'
  ]);
  mockOrderingService.getScorableClaimOrdering.and.returnValue(
    of(ordering(byString))
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReportingCommonModule, TranslateModule.forRoot(), TestModule],
      declarations: [ResultsByStudentComponent, TestComponentWrapper],
      providers: [
        MenuActionBuilder,
        InstructionalResourcesService,
        CachingDataService,
        { provide: ReportFormService, useValue: {} },
        { provide: OrderingService, useValue: mockOrderingService }
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
    <results-by-student
      [assessment]="assessment"
      [exams]="[]"
      [minimumItemDataYear]="2017"
      [scoreType]="'Overall'"
      [subjectDefinition]="subjectDefinition"
    ></results-by-student>
  `
})
class TestComponentWrapper {
  assessment = {
    alternateScoreCodes: ['a'],
    claimCodes: ['b']
  };
  subjectDefinition = <SubjectDefinition>{
    overallScore: {},
    alternateScore: {
      codes: ['a']
    },
    claimScore: {
      codes: ['c']
    }
  };
}
