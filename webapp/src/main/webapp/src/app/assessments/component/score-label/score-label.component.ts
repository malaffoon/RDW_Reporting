import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'score-label',
  templateUrl: './score-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreLabelComponent {
  @Input()
  subjectCode: string;

  @Input()
  scoreCode: string;
}
