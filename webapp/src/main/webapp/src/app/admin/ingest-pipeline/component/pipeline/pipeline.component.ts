import { Component, Input } from '@angular/core';
import { IngestPipelineScript } from '../../model/script';

@Component({
  selector: 'pipeline',
  templateUrl: './pipeline.component.html'
})
export class PipelineComponent {
  @Input()
  scripts: IngestPipelineScript[];
}
