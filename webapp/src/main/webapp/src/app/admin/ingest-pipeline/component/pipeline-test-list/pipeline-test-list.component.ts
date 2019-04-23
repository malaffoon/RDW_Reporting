import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { PipelineTest } from '../../model/pipeline';

@Component({
  selector: 'pipeline-test-list',
  templateUrl: './pipeline-test-list.component.html',
  styleUrls: ['./pipeline-test-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestListComponent {
  @Input()
  tests: PipelineTest[];

  @Output()
  testClick: EventEmitter<PipelineTest> = new EventEmitter();
}
