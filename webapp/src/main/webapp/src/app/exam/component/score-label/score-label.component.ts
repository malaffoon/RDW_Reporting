import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreType } from '../../model/score-statistics';

interface TranslationCodes {
  name: (subjectCode?: string, scoreCode?: string) => string;
  icon?: (subjectCode?: string, scoreCode?: string) => string;
}

const translationCodesByScoreType: Map<ScoreType, TranslationCodes> = new Map<
  ScoreType,
  TranslationCodes
>([
  [
    'Overall',
    {
      name: () => 'average-scale-score.overall-score-distribution'
    }
  ],
  [
    'Alternate',
    {
      name: (subjectCode, scoreCode) =>
        `subject.${subjectCode}.alt.${scoreCode}.name`,
      icon: (subjectCode, scoreCode) =>
        `subject.${subjectCode}.alt.${scoreCode}.icon`
    }
  ],
  [
    'Claim',
    {
      name: (subjectCode, scoreCode) =>
        `subject.${subjectCode}.claim.${scoreCode}.name`,
      icon: (subjectCode, scoreCode) =>
        `subject.${subjectCode}.claim.${scoreCode}.icon`
    }
  ]
]);

@Component({
  selector: 'score-label',
  templateUrl: './score-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreLabelComponent {
  _subjectCode: string;
  _scoreCode: string;
  _scoreType: ScoreType;
  _name: string;
  _icon: string;

  @Input()
  set subjectCode(value: string) {
    this._subjectCode = value;
    this.initialize();
  }

  @Input()
  set scoreCode(value: string) {
    this._scoreCode = value;
    this.initialize();
  }

  @Input()
  set scoreType(value: ScoreType) {
    this._scoreType = value;
    this.initialize();
  }

  private initialize() {
    const {
      _subjectCode: subjectCode,
      _scoreCode: scoreCode,
      _scoreType: scoreType
    } = this;

    if (subjectCode == null || scoreType == null) {
      return;
    }
    const codes = translationCodesByScoreType.get(scoreType);
    this._name = codes.name(subjectCode, scoreCode);
    this._icon =
      codes.icon != null ? codes.icon(subjectCode, scoreCode) : undefined;
  }
}
