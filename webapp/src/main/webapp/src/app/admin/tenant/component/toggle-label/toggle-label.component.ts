import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-toggle-label',
  templateUrl: './toggle-label.component.html',
  styleUrls: ['./toggle-label.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleLabelComponent {
  @Input()
  open: boolean;

  @Input()
  openLabel: boolean;

  @Input()
  closedLabel: boolean;

  @Output()
  openChange: EventEmitter<boolean> = new EventEmitter();
}
