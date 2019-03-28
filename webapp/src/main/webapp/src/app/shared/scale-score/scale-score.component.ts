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
  @Input()
  score: number;

  @Input()
  standardError: number;

  @Input()
  background: boolean;
}
