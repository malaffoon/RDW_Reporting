import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-divider-link',
  templateUrl: './divider-link.component.html',
  styleUrls: ['./divider-link.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerLinkComponent {
  @Input()
  justify: string = 'center';
}
