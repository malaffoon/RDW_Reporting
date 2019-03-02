import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { ModalModule } from "ngx-bootstrap";
import { Angulartics2Module } from "angulartics2";
import { CommonModule } from "../shared/common.module";
import { StudentReportDownloadComponent } from "./student-report-download.component";
import { ReportsResolve } from "./reports.resolve";
import { ReportsComponent } from "./reports.component";
import { GroupReportDownloadComponent } from "./group-report-download.component";
import { SchoolGradeDownloadComponent } from "./school-grade-report-download.component";
import { ReportActionService } from "./report-action.service";
import { ReportActionComponent } from "./report-action.component";
import { RdwMenuModule } from "../shared/menu/rdw-menu.module";
import { TableModule } from "primeng/table";
import { ReportTableComponent } from './report-table.component';
import { UserReportService } from './user-report.service';

@NgModule({
  declarations: [
    ReportsComponent,
    ReportTableComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent,
    ReportActionComponent
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
    TableModule
  ],
  exports: [
    ReportsComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent
  ],
  providers: [
    ReportsResolve,
    ReportActionService,
    UserReportService
  ]
})
export class ReportModule {
}
