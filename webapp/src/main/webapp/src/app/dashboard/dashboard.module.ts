import { NgModule } from '@angular/core';
import { GroupAssessmentCardComponent } from './group-dashboard/group-assessment-card.component';
import { GroupDashboardComponent } from './group-dashboard/group-dashboard.component';
import { ReportModule } from '../report/report.module';
import { Angulartics2Module } from 'angulartics2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssessmentsModule } from '../assessments/assessments.module';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/primeng';
import { GroupDashboardService } from './group-dashboard/group-dashboard.service';
import { MeasuredAssessmentMapper } from './measured-assessment.mapper';
import { StudentAssessmentCardComponent } from './student-dashboard/student-assessment-card.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    GroupDashboardComponent,
    GroupAssessmentCardComponent,
    StudentAssessmentCardComponent
  ],
  imports: [
    Angulartics2Module,
    AssessmentsModule,
    CommonModule,
    ReportingCommonModule,
    FormsModule,
    PopoverModule,
    ReportModule,
    SharedModule,
    TableModule
  ],
  exports: [GroupAssessmentCardComponent, StudentAssessmentCardComponent],
  providers: [GroupDashboardService, MeasuredAssessmentMapper]
})
export class DashboardModule {}
