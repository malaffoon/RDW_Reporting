import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { PopoverModule } from "ngx-bootstrap";
import { Angulartics2Module } from "angulartics2";
import { ReportService } from "./report.service";
import { CommonModule } from "../shared/common.module";
import { StudentReportDownloadComponent } from "./student-report-download.component";
import { ReportsResolve } from "./reports.resolve";
import { ReportsComponent } from "./reports.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { GroupReportDownloadComponent } from "./group-report-download.component";
import { SchoolGradeDownloadComponent } from "./school-grade-report-download.component";
import { AssessmentsModule } from "../assessments/assessments.module";

@NgModule({
  declarations: [
    ReportsComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DataTableModule,
    AssessmentsModule, // for info-label (should probably move to shared/common)
    Angulartics2Module.forChild()
  ],
  exports: [
    ReportsComponent,
    StudentReportDownloadComponent,
    GroupReportDownloadComponent,
    SchoolGradeDownloadComponent
  ],
  providers: [
    ReportService,
    ReportsResolve
  ]
})
export class ReportModule {
}
