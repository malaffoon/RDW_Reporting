import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { GroupsComponent } from './groups.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/primeng';
import { GroupResultsComponent } from './results/group-results.component';
import { AssessmentsModule } from '../assessments/assessments.module';
import { GroupAssessmentService } from './results/group-assessment.service';
import { GroupAssessmentResolve } from './results/group-assessment.resolve';
import { Angulartics2Module } from 'angulartics2';
import { ReportModule } from '../report/report.module';
import { PopoverModule, TabsModule } from 'ngx-bootstrap';
import { GroupAssessmentExportService } from './results/group-assessment-export.service';
import { GroupService } from './group.service';
import { TableModule } from 'primeng/table';
import { UserGroupModule } from '../user-group/user-group.module';
import { GroupTableComponent } from './group-table.component';
import { GroupTabsComponent } from './group-tabs.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupTableComponent,
    GroupTabsComponent,
    GroupResultsComponent
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
    TableModule,
    TabsModule,
    UserGroupModule
  ],
  exports: [GroupTabsComponent],
  providers: [
    GroupService,
    GroupAssessmentResolve,
    GroupAssessmentService,
    GroupAssessmentExportService
  ]
})
export class GroupsModule {}
