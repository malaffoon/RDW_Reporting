import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AggregateScoreGraphComponent } from './component/aggregate-score-graph/aggregate-score-graph.component';
import { ClaimScoreSummaryComponent } from './component/claim-score-summary/claim-score-summary.component';
import { OverallScoreSummaryComponent } from './component/overall-score-summary/overall-score-summary.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { ScoreLabelComponent } from './component/score-label/score-label.component';
import { ScoreTableComponent } from './component/score-table/score-table.component';
import { CommonModule } from '../shared/common.module';
import { PopoverModule } from 'ngx-bootstrap';

@NgModule({
  imports: [BrowserModule, CommonModule, PopoverModule, TranslateModule],
  declarations: [
    AggregateScoreGraphComponent,
    ClaimScoreSummaryComponent,
    OverallScoreSummaryComponent,
    ProgressBarComponent,
    ScoreLabelComponent,
    ScoreTableComponent
  ],
  exports: [ScoreTableComponent, OverallScoreSummaryComponent]
})
export class ExamModule {}
