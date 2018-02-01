import { Angulartics2Module } from "angulartics2";
import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { DataTableModule } from "primeng/primeng";
import { MockAggregateReportsService } from "./results/mock-aggregate-reports.service";
import { BrowserModule } from "@angular/platform-browser";
import { AggregateReportsTableComponent } from "./results/aggregate-reports-table.component";
import { AssessmentDetailsService } from "./results/assessment-details.service";
import { PerformanceComparisonComponent } from "./results/performance-comparison.component";
import { QueryBuilderComponent } from "./results/query-builder.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from "angular-2-dropdown-multiselect";
import { ReportOptionsService } from "./results/report-options.service";
import { AggregateReportFormResolve } from "./aggregate-report-form.resolve";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportSummary } from "./aggregate-report-summary.component";
import { AggregateReportsPreviewTableComponent } from "./aggregate-reports-preview-table.component";
import { MockAggregateReportsPreviewService } from "./results/mock-aggregate-reports-preview.service";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { ModalModule, TypeaheadModule } from "ngx-bootstrap";
import { AggregateReportOrganizationList } from "./aggregate-report-organization-list.component";
import { AggregateReportService } from "./aggregate-report.service";
import { ReportModule } from "../report/report.module";
import { AggregateReportConfirmationModal } from "./aggregate-report-confirmation.modal";
import { AggregateReportFormComponent } from "./aggregate-report-form.component";
import { AggregateReportComponent } from "./results/aggregate-report.component";

@NgModule({
  declarations: [
    AggregateReportConfirmationModal,
    AggregateReportFormComponent,
    AggregateReportComponent,
    AggregateReportsTableComponent,
    AggregateReportsPreviewTableComponent,
    PerformanceComparisonComponent,
    QueryBuilderComponent,
    AggregateReportSummary,
    AggregateReportOrganizationList
  ],
  imports: [
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    MultiselectDropdownModule,
    TypeaheadModule,
    ModalModule,
    ReportModule
  ],
  exports: [
    AggregateReportComponent,
    AggregateReportFormComponent,
    AggregateReportsTableComponent,
    AggregateReportsPreviewTableComponent,
    PerformanceComparisonComponent,
    QueryBuilderComponent
  ],
  entryComponents: [
    AggregateReportConfirmationModal
  ],
  providers: [
    AssessmentDetailsService,
    MockAggregateReportsService,
    MockAggregateReportsPreviewService,
    ReportOptionsService,
    AggregateReportService,
    AggregateReportFormResolve,
    AggregateReportOptionsService,
    AggregateReportFormOptionsMapper,
    AggregateReportOrganizationService
  ]
})
export class AggregateReportsModule {
}
