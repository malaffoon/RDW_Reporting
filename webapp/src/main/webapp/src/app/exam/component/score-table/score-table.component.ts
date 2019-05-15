import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef
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
  levelHeadingTemplate: TemplateRef<any>;
}
