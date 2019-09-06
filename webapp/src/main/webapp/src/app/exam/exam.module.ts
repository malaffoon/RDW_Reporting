import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AggregateScoreGraphComponent } from './component/aggregate-score-graph/aggregate-score-graph.component';
import { ClaimScoreSummaryComponent } from './component/claim-score-summary/claim-score-summary.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { ScoreLabelComponent } from './component/score-label/score-label.component';
import { ScoreTableComponent } from './component/score-table/score-table.component';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { PopoverModule } from 'ngx-bootstrap';
import { AssessmentLabelComponent } from './component/assessment-label/assessment-label.component';
import { ShowResultsDividerComponent } from './component/show-results-divider/show-results-divider.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ReportingCommonModule,
    PopoverModule,
    TranslateModule
  ],
  declarations: [
    AggregateScoreGraphComponent,
    AssessmentLabelComponent,
    ClaimScoreSummaryComponent,
    ProgressBarComponent,
    ScoreLabelComponent,
    ScoreTableComponent,
    ShowResultsDividerComponent
  ],
  exports: [
    AssessmentLabelComponent,
    ScoreTableComponent,
    ShowResultsDividerComponent,
    ClaimScoreSummaryComponent
  ]
})
export class ExamModule {}
