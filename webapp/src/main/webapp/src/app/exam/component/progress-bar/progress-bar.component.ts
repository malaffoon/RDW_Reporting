import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// TODO move to shared
@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input()
  percent: number;

  @Input()
  color: string;
}
