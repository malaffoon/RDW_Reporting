import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'show-more-divider',
  templateUrl: './show-more-divider.component.html',
  styleUrls: ['./show-more-divider.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowMoreDividerComponent {
  @Input()
  collapsed: boolean;

  @Output()
  collapsedChanged: EventEmitter<boolean> = new EventEmitter();
}
