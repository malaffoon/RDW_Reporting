import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
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
  description: string;

  @Output()
  itemClick: EventEmitter<MouseEvent> = new EventEmitter();

  _active: boolean;

  @ViewChild('element')
  elementReference: ElementRef<HTMLElement>;

  @Input()
  set active(value: boolean) {
    this._active = value;
    if (value && this.elementReference != null) {
      this.elementReference.nativeElement.scrollIntoView({
        block: 'nearest'
      });
    }
  }
}
