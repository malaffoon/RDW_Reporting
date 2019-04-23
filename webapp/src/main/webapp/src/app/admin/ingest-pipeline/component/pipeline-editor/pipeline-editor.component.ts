import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CompilationError, Pipeline, TestResult } from '../../model/pipeline';
import { Message } from '../code-editor/code-editor.component';

export type PipelineEditorTab = 'Script' | 'Tests' | 'TestResults';

@Component({
  selector: 'pipeline-editor',
  templateUrl: './pipeline-editor.component.html',
  styleUrls: ['./pipeline-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineEditorComponent {
  @Input()
  selectedTab: PipelineEditorTab = 'Script';

  @Output()
  tabClick: EventEmitter<PipelineEditorTab> = new EventEmitter();

  @Output()
  scriptChange: EventEmitter<string> = new EventEmitter();

  @Output()
  scriptSave: EventEmitter<Pipeline> = new EventEmitter();

  @Output()
  scriptTest: EventEmitter<Pipeline> = new EventEmitter();

  @Output()
  scriptPublish: EventEmitter<Pipeline> = new EventEmitter();

  @Input()
  compiling: boolean;

  @Input()
  compilationErrors: CompilationError[] = [];

  @Input()
  testing: boolean;

  @Input()
  testResults: TestResult[] = [];

  @Input()
  tested: boolean;

  @Input()
  testButtonDisabled: boolean;

  @Input()
  saving: boolean;

  @Input()
  saved: boolean;

  @Input()
  saveButtonDisabled: boolean;

  @Input()
  messages: Message[];

  @Input()
  publishing: boolean;

  @Input()
  publishButtonDisabled: boolean;

  @Input()
  pipeline: Pipeline;
}
