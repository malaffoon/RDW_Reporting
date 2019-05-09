import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ScoreTable } from './score-table';

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreTableComponent {
  @Input()
  displayCount: boolean;

  @Input()
  table: ScoreTable;

  @Input()
  showInstructionalResources: boolean;

  @Input()
  instructionalResourcePopover: any;

  @Output()
  instructionalResourceClick: EventEmitter<number> = new EventEmitter();
}
