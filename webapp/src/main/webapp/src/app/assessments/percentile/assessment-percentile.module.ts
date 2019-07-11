import { NgModule } from '@angular/core';
import { AssessmentPercentileTable } from './assessment-percentile-table.component';
import { AssessmentPercentileService } from './assessment-percentile.service';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { AssessmentPercentileHistoryComponent } from './assessment-percentile-history.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AssessmentPercentileHistoryComponent,
    AssessmentPercentileTable
  ],
  imports: [CommonModule, ReportingCommonModule, TableModule],
  exports: [AssessmentPercentileHistoryComponent],
  providers: [AssessmentPercentileService]
})
export class AssessmentPercentileModule {}
