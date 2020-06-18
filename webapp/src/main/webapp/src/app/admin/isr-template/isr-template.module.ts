import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IsrTemplateComponent } from './isr-template.component';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { isrTemplateRoutes } from './isr-template.routes';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { ButtonModule } from 'primeng/button';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { FileUploadModule } from 'primeng/fileupload';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplateDeleteModal } from './isr-template-delete.modal';

@NgModule({
  declarations: [IsrTemplateDeleteModal, IsrTemplateComponent],
  entryComponents: [IsrTemplateDeleteModal],
  imports: [
    ButtonModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    ModalModule.forRoot(),
    ReportingCommonModule,
    RouterModule.forChild(isrTemplateRoutes),
    TableModule,
    TranslateModule.forChild(translateModuleConfiguration),
    TooltipModule
  ],
  providers: [IsrTemplateService]
})
export class IsrTemplateModule {}
