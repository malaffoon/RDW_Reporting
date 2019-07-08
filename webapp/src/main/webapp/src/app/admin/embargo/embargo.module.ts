import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmbargoComponent } from './embargo.component';
import { ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { Toggle } from './toggle.component';
import { EmbargoTable } from './embargo-table.component';
import { EmbargoConfirmationModal } from './embargo-confirmation-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { EmbargoResolve } from './embargo.resolve';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { embargoRoutes } from './embargo.routes';

@NgModule({
  imports: [
    CommonModule,
    ButtonsModule,
    ReportingCommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    TableModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(embargoRoutes)
  ],
  declarations: [
    EmbargoComponent,
    EmbargoTable,
    Toggle,
    EmbargoConfirmationModal
  ],
  providers: [EmbargoResolve],
  entryComponents: [EmbargoConfirmationModal]
})
export class EmbargoModule {}
