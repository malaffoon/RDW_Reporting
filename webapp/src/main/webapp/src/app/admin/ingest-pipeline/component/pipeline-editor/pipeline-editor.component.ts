import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  ScriptError,
  Pipeline,
  PipelineScript,
  PipelineTest
} from '../../model/pipeline';
import { Message, ThemeType } from '../code-editor/code-editor.component';
import { Item } from '../pipeline-explorer/pipeline-explorer.component';
import { CompilationState, PipelineState } from '../../model/pipeline-state';
import { isValidPipelineTest } from '../../model/pipelines';

@Component({
  selector: 'pipeline-editor',
  templateUrl: './pipeline-editor.component.html',
  styleUrls: ['./pipeline-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineEditorComponent {
  readonly isValidPipelineTest = isValidPipelineTest;

  @Input()
  readonly: boolean;

  @Input()
  pipeline: Pipeline;

  @Input()
  hasPublishedScript: boolean;

  @Output()
  scriptChange: EventEmitter<string> = new EventEmitter();

  @Output()
  scriptUpdate: EventEmitter<PipelineScript> = new EventEmitter();

  @Output()
  scriptTest: EventEmitter<PipelineScript> = new EventEmitter();

  @Output()
  scriptPublish: EventEmitter<PipelineScript> = new EventEmitter();

  @Input()
  compilationState: CompilationState;

  @Input()
  compilationErrors: ScriptError[] = [];

  @Input()
  messages: Message[];

  @Input()
  saving: boolean;

  @Input()
  saved: boolean;

  @Input()
  saveButtonDisabledTooltip: string;

  @Input()
  testResults: PipelineTest[] = [];

  @Input()
  testState: PipelineState;

  @Input()
  testButtonDisabled: boolean;

  @Input()
  testButtonDisabledTooltip: string;

  @Input()
  publishState: PipelineState;

  @Input()
  publishButtonDisabled: boolean;

  @Input()
  publishButtonDisabledTooltip: string;

  @Output()
  testChange: EventEmitter<Item<PipelineTest>> = new EventEmitter();

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

  @Input()
  selectedItemLoading: boolean = true;

  @Output()
  itemSelected: EventEmitter<Item> = new EventEmitter();

  @Output()
  testCreate: EventEmitter<void> = new EventEmitter();

  @Output()
  testDelete: EventEmitter<Item<PipelineTest>> = new EventEmitter();

  // extras

  @Input()
  codeEditorTheme: ThemeType = 'light';
}
