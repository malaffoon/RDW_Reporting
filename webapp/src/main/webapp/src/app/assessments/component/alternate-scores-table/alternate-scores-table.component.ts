import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubjectDefinition } from '../../../subject/subject';
import { ScoreStatistics } from '../../model/score-statistics';

function toScoreStatistics(
  subjectDefinition: SubjectDefinition
): ScoreStatistics {
  const {
    alternateScoreCodes: scoreCodes,
    performanceLevels
  } = subjectDefinition;
  const groups = scoreCodes.map((code, scoreIndex) => ({
    code,
    averageScaleScore: 2200,
    standardError: 15,
    performanceLevelScores: performanceLevels.map(
      (performanceLevel, performanceLevelIndex) => ({
        count: 2,
        percent: 100 - (scoreIndex + performanceLevelIndex) * 10
      })
    )
  }));
  return {
    subjectDefinition,
    resultCount: 20,
    groups
  };
}

// TODO paramatrize score codes
@Component({
  selector: 'alternate-scores-table',
  templateUrl: './alternate-scores-table.component.html',
  styleUrls: ['./alternate-scores-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlternateScoresTableComponent {
  @Input()
  displayCount: boolean;

  scoreStatistics: ScoreStatistics;

  _orderedPerformanceLevels: number[];

  // TODO accept ScoreStatistics
  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    this.scoreStatistics = toScoreStatistics(value);
    this._orderedPerformanceLevels = value.alternateScorePerformanceLevels
      .slice()
      .reverse();
  }
}
