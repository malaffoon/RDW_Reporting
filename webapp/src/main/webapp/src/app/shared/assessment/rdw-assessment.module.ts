import { NgModule } from '@angular/core';
import { PerformanceLevelDistributionChart } from './performanc-level/performance-level-distribution-chart.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PerformanceLevelDistributionChart],
  imports: [CommonModule, FormsModule, TranslateModule.forRoot()],
  exports: [PerformanceLevelDistributionChart]
})
export class RdwAssessmentModule {}
