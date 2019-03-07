import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/components/common/shared';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { Angulartics2Module } from 'angulartics2';
import { CommonModule } from '../shared/common.module';
import { StudentReportDownloadComponent } from './student-report-download.component';
import { ReportsResolve } from './reports.resolve';
import { ReportsComponent } from './reports.component';
import { GroupReportDownloadComponent } from './group-report-download.component';
import { SchoolGradeDownloadComponent } from './school-grade-report-download.component';
import { RdwMenuModule } from '../shared/menu/rdw-menu.module';
import { TableModule } from 'primeng/table';
import { UserReportTableComponent } from './user-report-table.component';
import { UserQueryTableComponent } from './user-query-table.component';
import { UserReportService } from './user-report.service';
import { UserQueryService } from './user-query.service';
import { UserQueryStore } from './user-query.store';
import { UserReportMenuOptionService } from './user-report-menu-option.service';
import { UserQueryMenuOptionService } from './user-query-menu-option.service';

@NgModule({
  declarations: [
    ReportsComponent,
    UserReportTableComponent,
    UserQueryTableComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent
  ],
  imports: [
    Angulartics2Module.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    RdwMenuModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    TabsModule
  ],
  exports: [
    ReportsComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent
  ],
  providers: [
    ReportsResolve,
    UserReportService,
    UserReportMenuOptionService,
    UserQueryService,
    UserQueryStore,
    UserQueryMenuOptionService
  ]
})
export class ReportModule {}
