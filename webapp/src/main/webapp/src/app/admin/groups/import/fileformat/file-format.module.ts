import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileFormatComponent } from './file-format.component';
import { SharedModule } from 'primeng/components/common/shared';
import { FileFormatService } from './file-format.service';
import { ReportingCommonModule } from '../../../../shared/reporting-common.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FileFormatComponent],
  imports: [CommonModule, ReportingCommonModule, FormsModule, SharedModule],
  exports: [FileFormatComponent],
  providers: [FileFormatService]
})
export class FileFormatModule {}
