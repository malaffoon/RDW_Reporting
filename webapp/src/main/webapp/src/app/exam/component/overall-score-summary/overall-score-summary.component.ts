import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExamStatistics } from '../../../assessments/model/exam-statistics.model';
import { SubjectDefinition } from '../../../subject/subject';
import { Observable } from 'rxjs';
import { InstructionalResource } from '../../../shared/model/instructional-resource';
import { InstructionalResourcesService } from '../../../shared/service/instructional-resources.service';
import { map } from 'rxjs/operators';
import { AssessmentProvider } from '../../../assessments/assessment-provider.interface';
import { PerformanceLevelScore } from '../../model/score-statistics';

/**
 * Takes a count and a total and produces a non-NaN percent result.
 * If the total is zero the percent is zero.
 *
 * @param count The count
 * @param total The total
 */
function safePercent(count: number, total: number): number {
  return total !== 0 ? (count / total) * 100 : 0;
}

@Component({
  selector: 'overall-score-summary',
  templateUrl: './overall-score-summary.component.html',
  styleUrls: ['./overall-score-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverallScoreSummaryComponent {
  @Input()
  assessmentId: number;

  @Input()
  assessmentProvider: AssessmentProvider;

  _subjectDefinition: SubjectDefinition; // later bundle with stats
  _statistics: ExamStatistics;
  _showCount: boolean;
  _performanceLevelScores: PerformanceLevelScore[];
  _hasAverageScore: boolean;
  _averageScore: number;
  _totalCount: number;
  _instructionalResourcesProvider: () => Observable<InstructionalResource[]>;
  _initialized: boolean;

  constructor(
    private instructionalResourcesService: InstructionalResourcesService
  ) {}

  @Input()
  set showCount(value: boolean) {
    this._showCount = value;
    this.initialize();
  }

  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    this._subjectDefinition = value;
    this.initialize();
  }

  @Input()
  set statistics(value: ExamStatistics) {
    this._statistics = value;
    this.initialize();
  }

  private initialize(): boolean {
    if (
      this._statistics == null ||
      this._showCount == null ||
      this._subjectDefinition == null
    ) {
      return;
    }

    const { _statistics } = this;

    this._hasAverageScore = !isNaN(_statistics.average);
    this._averageScore = !isNaN(_statistics.average)
      ? Math.round(_statistics.average)
      : _statistics.average;

    if (_statistics.levels) {
      this._performanceLevelScores = _statistics.levels
        .map((level, index) => ({
          level: level.id,
          count: level.value,
          percent: Math.floor(_statistics.percents[index].value)
        }))
        .slice()
        .reverse();
    }

    this._initialized = true;
  }

  onInstructionalResourcesButtonClick(level: number): void {
    this._instructionalResourcesProvider = () =>
      this.instructionalResourcesService
        .getInstructionalResources(
          this.assessmentId,
          this.assessmentProvider.getSchoolId()
        )
        .pipe(map(resources => resources.getResourcesByPerformance(level)));
  }
}
