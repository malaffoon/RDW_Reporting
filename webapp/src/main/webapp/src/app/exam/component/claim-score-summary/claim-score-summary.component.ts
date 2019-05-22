import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubjectDefinition } from '../../../subject/subject';
import { ClaimStatistics } from '../../../assessments/model/claim-score.model';
import { OrderingService } from '../../../shared/ordering/ordering.service';
import { ExamStatistics } from '../../../assessments/model/exam-statistics.model';
import { chunk } from 'lodash';
import { roundPercentages } from '../../model/score-statistics';
import { ScoreTable } from '../score-table/score-table';

/**
 * This class provides an orderable reference to claim score statistics.
 */
class ClaimReference {
  code: string;
  dataIndex: number;
  stats: ClaimStatistics;
}

@Component({
  selector: 'claim-score-summary',
  templateUrl: './claim-score-summary.component.html',
  styleUrls: ['./claim-score-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimScoreSummaryComponent {
  @Input()
  table: ScoreTable;

  @Input()
  displayCount: boolean;
  //
  // _statistics: ExamStatistics;
  // _subjectDefinition: SubjectDefinition;
  // _showCount: boolean;
  // claimReferences: ClaimReference[][] = [];
  // claimReferenceRows = [0];
  // private _claimDataWidths: Array<number[]>;
  // _initialized: boolean;
  //
  // constructor(private orderingService: OrderingService) {}
  //
  // @Input()
  // set statistics(value: ExamStatistics) {
  //   this._statistics = value;
  //   this.initialize();
  // }
  //
  // @Input()
  // set subjectDefinition(value: SubjectDefinition) {
  //   this._subjectDefinition = value;
  //   this.initialize();
  // }
  //
  // @Input()
  // set showCount(value: boolean) {
  //   this._showCount = value;
  //   this.initialize();
  // }
  //
  // getClaimColumnCountClass(index: number): string {
  //   return index > 0
  //     ? `limit-width column-count-${this.claimReferences[index].length}`
  //     : '';
  // }
  //
  // getClaimDataWidth(claimIndex: number, levelIndex: number): number {
  //   if (!this._claimDataWidths || !this._claimDataWidths[claimIndex]) {
  //     return 0;
  //   }
  //   return this._claimDataWidths[claimIndex][levelIndex];
  // }
  //
  // getClaimValue(claimStats: ClaimStatistics, index: number): number {
  //   if (!this._claimDataWidths || !this._claimDataWidths[0]) {
  //     return 0;
  //   }
  //   return !this._showCount
  //     ? Math.round(claimStats.percents[index].value)
  //     : claimStats.levels[index].value;
  // }
  //
  // getClaimSuffix(claimStats: ClaimStatistics, index: number): string {
  //   return !this._showCount
  //     ? claimStats.percents[index].suffix
  //     : claimStats.levels[index].suffix;
  // }
  //
  // getLatestClaimReferences(): ClaimReference[] {
  //   if (this.claimReferences) {
  //     return this.claimReferences[this.claimReferences.length - 1];
  //   }
  // }
  //
  // get claimLevelRows(): any[] {
  //   // get array from 0 to levels-1
  //   const indexes = Array.apply(null, {
  //     length: this.claimReferences[0][0].stats.levels.length
  //   }).map(Function.call, Number);
  //
  //   // now split into rows with up to 3 per row
  //   return chunk(indexes, 3);
  // }
  //
  // private initialize(): void {
  //   if (
  //     this._subjectDefinition == null ||
  //     this._statistics == null ||
  //     this._showCount == null
  //   ) {
  //     return;
  //   }
  //
  //   this.orderingService
  //     .getScorableClaimOrdering(
  //       this._subjectDefinition.subject,
  //       this._subjectDefinition.assessmentType
  //     )
  //     .subscribe(ordering => {
  //       this._claimDataWidths = this._statistics.claims.map(claimStatistics =>
  //         roundPercentages(
  //           claimStatistics.percents.map(percent => percent.value)
  //         )
  //       );
  //
  //       const claimReferenceSingleArray = this._subjectDefinition.claimScore.codes
  //         .map((code, index) => ({
  //           code: code,
  //           dataIndex: index,
  //           stats: this._statistics.claims[index]
  //         }))
  //         .sort(
  //           ordering.on((reference: ClaimReference) => reference.code).compare
  //         );
  //
  //       // create an array [0, ...n] where n is the largest number where claimReferenceSingleArray.length % 4 === 0.
  //       // This used to determine how many chunks (of size <= 4) there are
  //       this.claimReferenceRows = claimReferenceSingleArray
  //         .filter((value, index) => index % 4 === 0)
  //         .map((value, index) => index);
  //
  //       this.claimReferences = chunk(claimReferenceSingleArray, 4);
  //
  //       this._initialized = true;
  //     });
  // }
}
