import { FactoryProvider, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/components/common/shared';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { Angulartics2Module } from 'angulartics2';
import { CommonModule } from '../shared/common.module';
import { ReportsComponent } from './reports.component';
import { RdwMenuModule } from '../shared/menu/rdw-menu.module';
import { TableModule } from 'primeng/table';
import { UserReportTableComponent } from './user-report-table.component';
import { UserQueryTableComponent } from './user-query-table.component';
import { UserReportService } from './user-report.service';
import { UserQueryService } from './user-query.service';
import { UserQueryStore } from './user-query.store';
import { UserReportMenuOptionService } from './user-report-menu-option.service';
import { UserQueryMenuOptionService } from './user-query-menu-option.service';
import { UserReportStore } from './user-report.store';
import { NameFieldProvider } from './provider/name-field.provider';
import { AccommodationsFieldProvider } from './provider/accommodations-field-provider';
import { AssessmentTypeFieldProvider } from './provider/assessment-type-field.provider';
import { LanguageFieldProvider } from './provider/language-field.provider';
import { OrderFieldProvider } from './provider/order-field.provider';
import { SchoolYearFieldProvider } from './provider/school-year-field.provider';
import { SubjectFieldProvider } from './provider/subject-field.provider';
import { TransferAccessFieldProvider } from './provider/transfer-access-field.provider';
import { ReportFormService } from './service/report-form.service';
import { RdwFormModule } from '../shared/form/rdw-form.module';
import { DeleteModalComponent } from './component/delete-modal/delete-modal.component';
import { PrintableReportFormModalComponent } from './component/printable-report-form-modal/printable-report-form-modal.component';

/**
 * Each of these field providers configure how the form field
 * 1. Will be constructed (declares dependencies)
 * 2. How the form field should be configured (what label it should have etc.)
 *
 * The reason these various fields are split up is because they all have different dependencies
 * and it felt weird resolving all of their dependencies and then passing the dependency blob
 * to each of them whether they needed all the info or not
 */
export const FieldProviders: FactoryProvider[] = [
  AccommodationsFieldProvider,
  AssessmentTypeFieldProvider,
  LanguageFieldProvider,
  NameFieldProvider,
  OrderFieldProvider,
  SchoolYearFieldProvider,
  SubjectFieldProvider,
  TransferAccessFieldProvider
];

@NgModule({
  imports: [
    Angulartics2Module,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ModalModule,
    RdwMenuModule,
    RdwFormModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    TabsModule
  ],
  providers: [
    ReportFormService,
    UserReportService,
    UserReportStore,
    UserReportMenuOptionService,
    UserQueryService,
    UserQueryStore,
    UserQueryMenuOptionService,
    ...FieldProviders
  ],
  declarations: [
    DeleteModalComponent,
    PrintableReportFormModalComponent,
    ReportsComponent,
    UserReportTableComponent,
    UserQueryTableComponent
  ],
  entryComponents: [DeleteModalComponent, PrintableReportFormModalComponent]
})
export class ReportModule {}
