import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IsrTemplateComponent } from './isr-template.component';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { isrTemplateRoutes } from './isr-template.routes';
import { TooltipModule } from 'ngx-bootstrap';
import { ButtonModule } from 'primeng/button';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { FileUploadModule } from 'primeng/fileupload';
import { IsrTemplateService } from './service/isr-template.service';

@NgModule({
  declarations: [IsrTemplateComponent],
  imports: [
    ButtonModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReportingCommonModule,
    RouterModule.forChild(isrTemplateRoutes),
    TableModule,
    TranslateModule.forChild(translateModuleConfiguration),
    TooltipModule
  ],
  providers: [IsrTemplateService]
})
export class IsrTemplateModule {}
