import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'pipeline-item',
  templateUrl: './pipeline-item.component.html',
  styleUrls: ['./pipeline-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineItemComponent {
  @Input()
  name: string;

  @Input()
  caption: string;

  @Input()
  description: string;

  @Input()
  active: boolean;

  @Output()
  itemClick: EventEmitter<MouseEvent> = new EventEmitter();
}
