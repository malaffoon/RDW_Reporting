import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  CompilationError,
  Pipeline,
  PipelineTest,
  TestResult
} from '../../model/pipeline';
import { Message, ThemeType } from '../code-editor/code-editor.component';
import { Item } from '../pipeline-explorer/pipeline-explorer.component';

@Component({
  selector: 'pipeline-editor',
  templateUrl: './pipeline-editor.component.html',
  styleUrls: ['./pipeline-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineEditorComponent {
  @Input()
  pipeline: Pipeline;

  @Output()
  scriptChange: EventEmitter<string> = new EventEmitter();

  @Output()
  scriptUpdate: EventEmitter<Pipeline> = new EventEmitter();

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

  @Output()
  testRun: EventEmitter<PipelineTest> = new EventEmitter();

  @Output()
  testUpdate: EventEmitter<PipelineTest> = new EventEmitter();

  @Input()
  testUpdating: boolean;

  // pipeline-explorer

  @Input()
  items: Item[] = [];

  @Input()
  selectedItem: Item;

  @Output()
  itemSelected: EventEmitter<Item> = new EventEmitter();

  @Output()
  testCreate: EventEmitter<void> = new EventEmitter();

  @Output()
  testDelete: EventEmitter<PipelineTest> = new EventEmitter();

  // extras

  @Input()
  codeEditorTheme: ThemeType = 'light';
}
