import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Pipeline, PipelineScript } from '../../model/pipeline';

@Component({
  selector: 'pipeline-published-scripts',
  templateUrl: './pipeline-published-scripts.component.html',
  styleUrls: ['./pipeline-published-scripts.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelinePublishedScriptsComponent {
  @Input()
  pipeline: Pipeline;

  @Input()
  scripts: PipelineScript[];

  @Input()
  selectedScript: PipelineScript;

  @Output()
  scriptSelect: EventEmitter<PipelineScript> = new EventEmitter();

  @Output()
  scriptOpen: EventEmitter<PipelineScript> = new EventEmitter();

  @Output()
  scriptPublish: EventEmitter<PipelineScript> = new EventEmitter();
}
