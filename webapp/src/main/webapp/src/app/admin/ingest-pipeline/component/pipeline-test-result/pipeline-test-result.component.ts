import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { InputType, PipelineTestRun } from '../../model/pipeline';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
  selector: 'pipeline-test-result',
  templateUrl: './pipeline-test-result.component.html',
  styleUrls: ['./pipeline-test-result.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestResultComponent {
  @Input()
  inputType: InputType;

  @Input()
  testRun: PipelineTestRun;

  @ViewChild('input')
  input: CodeEditorComponent;

  @ViewChild('output')
  output: CodeEditorComponent;
}
