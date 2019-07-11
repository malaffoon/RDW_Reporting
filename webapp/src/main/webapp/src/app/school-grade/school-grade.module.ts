import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule, DropdownModule } from 'primeng/primeng';
import { SchoolGradeComponent } from './school-grade.component';
import { SchoolService } from './school.service';
import { SchoolResultsComponent } from './results/school-results.component';
import { SchoolAssessmentResolve } from './results/school-assessments.resolve';
import { AssessmentsModule } from '../assessments/assessments.module';
import { SchoolAssessmentService } from './results/school-assessment.service';
import { CurrentSchoolResolve } from './results/current-school.resolve';
import { Angulartics2Module } from 'angulartics2';
import { ReportModule } from '../report/report.module';
import { TypeaheadModule } from 'ngx-bootstrap';
import { SchoolAssessmentExportService } from './results/school-assessment-export.service';
import { OrganizationService } from '../shared/organization/organization.service';
import { SchoolService as CommonSchoolService } from '../shared/school/school.service';
import { CommonModule } from '@angular/common';

/**
 * This module contains a search component for finding assessments
 * by school and grade.
 */
@NgModule({
  declarations: [SchoolGradeComponent, SchoolResultsComponent],
  imports: [
    ReportingCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AssessmentsModule,
    DropdownModule,
    SharedModule,
    ReportModule,
    TypeaheadModule,
    Angulartics2Module
  ],
  exports: [SchoolGradeComponent, SchoolResultsComponent],
  providers: [
    CurrentSchoolResolve,
    OrganizationService,
    CommonSchoolService,
    SchoolAssessmentResolve,
    SchoolAssessmentService,
    SchoolAssessmentExportService,
    SchoolService
  ]
})
export class SchoolGradeModule {}
