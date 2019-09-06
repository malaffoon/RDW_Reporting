import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef
} from '@angular/core';
import { ScoreTable } from './score-table';
import { scoresReported } from '../../model/score-statistics';

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreTableComponent {
  readonly scoresReported = scoresReported;

  @Input()
  displayCount: boolean;

  @Input()
  table: ScoreTable;

  @Input()
  levelHeadingTemplate: TemplateRef<any>;
}
