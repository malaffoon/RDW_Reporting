import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-property-override-table-controls',
  templateUrl: './property-override-table-controls.component.html',
  styleUrls: ['./property-override-table-controls.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyOverrideTableControlsComponent {
  @Output()
  search: EventEmitter<string> = new EventEmitter();

  @Input()
  required: boolean;

  @Output()
  requiredChanged: EventEmitter<boolean> = new EventEmitter();

  @Input()
  modified: boolean;

  @Output()
  modifiedChanged: EventEmitter<boolean> = new EventEmitter();
}
