import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { TestResultsComponent } from './test-results.component';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { testResultsRoutes } from './test-results.routes';
import { ChangeTestResultsStatusModal } from './change-test-results-status-modal';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    ReportingCommonModule,
    FormsModule,
    ModalModule.forRoot(),
    TableModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(testResultsRoutes),
    BsDropdownModule
  ],
  declarations: [TestResultsComponent, ChangeTestResultsStatusModal]
})
export class TestResultsModule {}
