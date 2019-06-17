import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Pipeline, PublishedPipeline } from '../../model/pipeline';

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
  selectedPipeline: PublishedPipeline;

  @Output()
  pipelineSelect: EventEmitter<PublishedPipeline> = new EventEmitter();

  @Output()
  pipelineActivate: EventEmitter<Pipeline> = new EventEmitter();

  @Output()
  pipelineDeactivate: EventEmitter<Pipeline> = new EventEmitter();

  _pipelines: PublishedPipeline[];

  @Input()
  pipelines: PublishedPipeline[];

  onActivateButtonClick(value: PublishedPipeline): void {
    this.pipelineActivate.emit({
      ...this.pipeline,
      activeVersion: value.version
    });
  }

  onDeactivateButtonClick(value: PublishedPipeline): void {
    this.pipelineDeactivate.emit({
      ...this.pipeline,
      activeVersion: null
    });
  }
}
