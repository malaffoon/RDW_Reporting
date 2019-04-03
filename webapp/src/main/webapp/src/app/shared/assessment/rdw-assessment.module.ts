import { NgModule } from '@angular/core';
import { PerformanceLevelDistributionChart } from './performanc-level/performance-level-distribution-chart.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PerformanceLevelDistributionChart],
  imports: [BrowserModule, FormsModule, TranslateModule.forRoot()],
  exports: [PerformanceLevelDistributionChart]
})
export class RdwAssessmentModule {}
