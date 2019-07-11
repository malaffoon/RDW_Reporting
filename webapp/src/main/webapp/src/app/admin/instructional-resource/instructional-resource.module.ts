import { NgModule } from '@angular/core';
import { InstructionalResourceComponent } from './instructional-resource.component';
import { ModalModule, TypeaheadModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { CreateInstructionalResourceModal } from './create-instructional-resource.modal';
import { InstructionalResourceService } from './instructional-resource.service';
import { AssessmentService } from './assessment.service';
import { OrganizationService } from './organization.service';
import { UpdateInstructionalResourceModal } from './update-instructional-resource.modal';
import { DeleteInstructionalResourceModal } from './delete-instructional-resource.modal';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { RdwMenuModule } from '../../shared/menu/rdw-menu.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { instructionalResourceRoutes } from './instructional-resource.routes';

@NgModule({
  declarations: [
    CreateInstructionalResourceModal,
    DeleteInstructionalResourceModal,
    InstructionalResourceComponent,
    UpdateInstructionalResourceModal
  ],
  entryComponents: [
    CreateInstructionalResourceModal,
    DeleteInstructionalResourceModal,
    UpdateInstructionalResourceModal
  ],
  imports: [
    CommonModule,
    ReportingCommonModule,
    FormsModule,
    ModalModule,
    RdwMenuModule,
    TableModule,
    TypeaheadModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(instructionalResourceRoutes)
  ],
  providers: [
    AssessmentService,
    InstructionalResourceService,
    OrganizationService
  ]
})
export class InstructionalResourceModule {}
