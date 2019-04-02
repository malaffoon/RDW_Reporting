import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubjectDefinition } from '../../../subject/subject';
import { ScoreStatistics, ScoreType } from '../../model/score-statistics';

const ScoreTypeQualifiersByType: Map<ScoreType, string> = new Map<
  ScoreType,
  string
>([['Overall', ''], ['Alternate', '.alt-score'], ['Claim', '.claim-score']]);

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
        level: performanceLevelIndex + 1,
        count: 2,
        percent: 100 - (scoreIndex + performanceLevelIndex) * 10
      })
    )
  }));
  return {
    scoreType: 'Alternate',
    subjectDefinition,
    resultCount: 20,
    groups
  };
}

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreTableComponent {
  @Input()
  displayCount: boolean;

  scoreStatistics: ScoreStatistics;

  _orderedPerformanceLevels: number[];
  _scoreTypeQualifier: string;

  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    // TODO later scoreStatistics will be passed in and computed from scoreType + subjectDef
    this.scoreStatistics = toScoreStatistics(value);
    this._orderedPerformanceLevels = value.alternateScore.levels
      .slice()
      .reverse();
    this._scoreTypeQualifier = ScoreTypeQualifiersByType.get(
      this.scoreStatistics.scoreType
    );
  }
}
