import { Component, Input } from '@angular/core';
import { AssessmentExam } from '../model/assessment-exam.model';
import {
  ExamStatistics,
  ExamStatisticsLevel
} from '../model/exam-statistics.model';
import { InstructionalResource } from '../../shared/model/instructional-resource';
import { InstructionalResourcesService } from '../../shared/service/instructional-resources.service';
import { ColorService } from '../../shared/color.service';
import { AssessmentProvider } from '../assessment-provider.interface';
import { Observable } from 'rxjs';
import { ClaimStatistics } from '../model/claim-score.model';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { Assessment } from '../model/assessment.model';
import { OrderingService } from '../../shared/ordering/ordering.service';
import { map } from 'rxjs/internal/operators';
import { SubjectDefinition } from '../../subject/subject';
import { ScoreType } from '../../exam/model/score-statistics';

/**
 * This component is responsible for displaying the average scale score visualization
 */
@Component({
  selector: 'average-scale-score',
  templateUrl: './average-scale-score.component.html'
})
export class AverageScaleScoreComponent {
  @Input()
  set assessmentExam(value: AssessmentExam) {
    this._assessmentExam = value;
    this.setScorableClaims();
  }

  @Input()
  set statistics(value: ExamStatistics) {
    if (!value) {
      return;
    }

    // reverse percents and levels so scale score statistics appear in descending order ("good" statistics levels comes before "bad")
    // TODO refactor - this has side-effects on the provided value
    value.percents = value.percents.reverse();
    value.levels = value.levels.reverse();
    this._statistics = value;

    this.averageScore = !isNaN(value.average)
      ? Math.round(value.average)
      : value.average;

    if (value.levels) {
      this._totalCount = value.levels
        .map(examStatisticsLevel => examStatisticsLevel.value)
        .reduce((total, levelCount) => {
          return total + levelCount;
        });
    }

    // pre-calculates the data widths for the graph representation for all of the claims
    this._claimDataWidths = value.claims.map(claimStatistics =>
      this.examCalculator.getDataWidths(
        claimStatistics.percents.map(percent => percent.value)
      )
    );

    this.setScorableClaims();
  }

  averageScore: number;

  @Input()
  subjectDefinition: SubjectDefinition;

  @Input()
  assessmentProvider: AssessmentProvider;

  @Input()
  scoreType: ScoreType;

  @Input()
  showValuesAsPercent: boolean;

  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;
  claimReferences: ClaimReference[][] = [];
  claimReferenceRows = [0];

  private _statistics: ExamStatistics;
  private _totalCount: number;
  private _claimDataWidths: Array<number[]>;
  private _assessmentExam: AssessmentExam;

  constructor(
    public colorService: ColorService,
    private instructionalResourcesService: InstructionalResourcesService,
    private examCalculator: ExamStatisticsCalculator,
    private orderingService: OrderingService
  ) {}

  get statistics(): ExamStatistics {
    return this._statistics;
  }

  get assessment(): Assessment {
    return this._assessmentExam.assessment;
  }

  get assessmentExam(): AssessmentExam {
    return this._assessmentExam;
  }

  getClaimDataWidth(claimIndex: number, levelIndex: number): number {
    if (!this._claimDataWidths || !this._claimDataWidths[claimIndex]) {
      return 0;
    }
    return this._claimDataWidths[claimIndex][levelIndex];
  }

  getClaimValue(claimStats: ClaimStatistics, index: number): number {
    if (!this._claimDataWidths || !this._claimDataWidths[0]) {
      return 0;
    }
    return this.showValuesAsPercent
      ? Math.round(claimStats.percents[index].value)
      : claimStats.levels[index].value;
  }

  getClaimSuffix(claimStats: ClaimStatistics, index: number): string {
    return this.showValuesAsPercent
      ? claimStats.percents[index].suffix
      : claimStats.levels[index].suffix;
  }

  get performanceLevels(): ExamStatisticsLevel[] {
    if (this.statistics == null) {
      return [];
    }

    return this.showValuesAsPercent
      ? this.statistics.percents
      : this.statistics.levels;
  }

  getLatestClaimReferences(): ClaimReference[] {
    if (this.claimReferences) {
      return this.claimReferences[this.claimReferences.length - 1];
    }
  }

  loadInstructionalResources(level: number): void {
    this.instructionalResourcesProvider = () =>
      this.instructionalResourcesService
        .getInstructionalResources(
          this._assessmentExam.assessment.id,
          this.assessmentProvider.getSchoolId()
        )
        .pipe(map(resources => resources.getResourcesByPerformance(level)));
  }

  get claimLevelRows(): any[] {
    // get array from 0 to levels-1
    const indexes = Array.apply(null, {
      length: this.claimReferences[0][0].stats.levels.length
    }).map(Function.call, Number);

    // now split into rows with up to 3 per row
    return this.chunkArray(indexes, 3);
  }

  /**
   * Returns an array with arrays of the given size.
   *
   * @param myArray {Array} Array to split
   * @param chunkSize {Integer} Size of every group
   */
  private chunkArray(myArray, chunk_size) {
    const results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }

  getClaimColumnCountClass(index): string {
    return index > 0
      ? `limit-width column-count-${this.claimReferences[index].length}`
      : '';
  }

  private setScorableClaims() {
    if (this.assessment == null || this.statistics == null) {
      return;
    }

    this.orderingService
      .getScorableClaimOrdering(this.assessment.subject, this.assessment.type)
      .subscribe(ordering => {
        const claimReferenceSingleArray = this.assessment.claimCodes
          .map(
            (code, idx) =>
              <ClaimReference>{
                code: code,
                dataIndex: idx,
                stats: this.statistics.claims[idx]
              }
          )
          .sort(
            ordering.on((reference: ClaimReference) => reference.code).compare
          );

        // create an array [0, ...n] where n is the largest number where claimReferenceSingleArray.length % 4 === 0.
        // This used to determine how many chunks (of size <= 4) there are
        this.claimReferenceRows = claimReferenceSingleArray
          .filter((value, index) => index % 4 === 0)
          .map((value, index) => index);
        while (claimReferenceSingleArray.length) {
          this.claimReferences.push(claimReferenceSingleArray.splice(0, 4));
        }
      });
  }
}

/**
 * This class provides an orderable reference to claim score statistics.
 */
class ClaimReference {
  code: string;
  dataIndex: number;
  stats: ClaimStatistics;
}
