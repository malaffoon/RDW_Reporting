import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  @Input()
  justify: string = 'center';
}
