import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { InputType, PipelineTest } from '../../model/pipeline';

@Component({
  selector: 'pipeline-test-form',
  templateUrl: './pipeline-test-form.component.html',
  styleUrls: ['./pipeline-test-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestFormComponent {
  @Input()
  inputType: InputType;

  @Input()
  test: PipelineTest;

  @Output()
  testChange: EventEmitter<PipelineTest> = new EventEmitter();
}
