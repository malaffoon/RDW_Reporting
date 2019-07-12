import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssessmentsComponent } from './select-assessments.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReportingCommonModule } from '../../../shared/reporting-common.module';
import { Assessment } from '../../model/assessment';
import { Angulartics2Module } from 'angulartics2';
import { TranslateModule } from '@ngx-translate/core';

describe('SelectAssessmentsComponent', () => {
  let component: SelectAssessmentsComponent;
  let fixture: ComponentFixture<SelectAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAssessmentsComponent],
      imports: [
        HttpModule,
        FormsModule,
        ReportingCommonModule,
        TranslateModule.forRoot(),
        Angulartics2Module.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should group assessments by grade', () => {
    let assessments = <Assessment[]>[
      { grade: '03', label: 'asmt1' },
      { grade: '03', label: 'asmt2' },
      { grade: '04', label: 'asmt3' },
      { grade: '05', label: 'asmt4' },
      { grade: '05', label: 'asmt5' }
    ];

    component.assessments = assessments;

    let actual = component.assessmentsByGrade;

    expect(actual[0].grade).toBe('03');
    expect(actual[0].assessments.length).toBe(2);

    expect(actual[1].grade).toBe('04');
    expect(actual[1].assessments.length).toBe(1);

    expect(actual[2].grade).toBe('05');
    expect(actual[2].assessments.length).toBe(2);
  });
});
