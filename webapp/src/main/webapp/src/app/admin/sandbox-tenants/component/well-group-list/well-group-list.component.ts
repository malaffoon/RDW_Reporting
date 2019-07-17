import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'app-well-group-list',
  templateUrl: './well-group-list.component.html',
  styleUrls: ['./well-group-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WellGroupListComponent<T> {
  @Input()
  items: T[];

  @Output()
  itemClick: EventEmitter<T> = new EventEmitter();

  @ContentChild('itemTemplate')
  itemTemplate: TemplateRef<any>;
}
