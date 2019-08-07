import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * This component is responsible for displaying a scale score
 * with the error band.
 */
@Component({
  selector: 'scale-score',
  templateUrl: './scale-score.component.html',
  styleUrls: ['./scale-score.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaleScoreComponent {
  @Input()
  background: boolean;

  @Input()
  infoEnabled: boolean;

  _score: number;
  _roundedScaleScore: number;

  _standardError?: number;
  _roundedStandardError: number;

  @Input()
  set score(value: number) {
    this._score = value;
    this._roundedScaleScore = Math.round(value);
  }

  @Input()
  set standardError(value: number) {
    this._standardError = value;
    this._roundedStandardError = Math.round(value);
  }
}
