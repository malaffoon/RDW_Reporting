import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * This component is responsible for displaying a scale score
 * with the error band.
 */
@Component({
  selector: 'scale-score',
  templateUrl: './scale-score.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaleScoreComponent {
  _hasScore: boolean;
  _roundedScaleScore: number;
  _roundedStandardError: number;

  @Input()
  background: boolean;

  @Input()
  set score(value: number) {
    this._hasScore = value != null;
    this._roundedScaleScore = Math.round(value);
  }

  @Input()
  set standardError(value: number) {
    this._roundedStandardError = Math.round(value);
  }
}
