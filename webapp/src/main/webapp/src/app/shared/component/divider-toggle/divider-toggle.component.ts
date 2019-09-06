import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-divider-toggle',
  templateUrl: './divider-toggle.component.html',
  styleUrls: ['./divider-toggle.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerToggleComponent {
  @Input()
  open: boolean;

  @Input()
  openLabel: boolean;

  @Input()
  closedLabel: boolean;

  @Output()
  openChange: EventEmitter<boolean> = new EventEmitter();

  @Input()
  justify: string = 'center';
}
