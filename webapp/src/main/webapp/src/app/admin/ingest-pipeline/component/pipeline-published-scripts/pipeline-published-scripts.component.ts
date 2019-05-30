import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Pipeline, PublishedPipeline } from '../../model/pipeline';
import { byDate } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

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

  _pipelines: PublishedPipeline[];

  @Input()
  set pipelines(values: PublishedPipeline[]) {
    this._pipelines = (values || []).slice().sort(
      ordering(byDate)
        .on(({ publishedOn }) => publishedOn)
        .reverse().compare
    );
  }

  onPipelineActivate(publishedPipeline: PublishedPipeline): void {
    this.pipelineActivate.emit({
      ...this.pipeline,
      activeVersion: publishedPipeline.version
    });
  }
}
