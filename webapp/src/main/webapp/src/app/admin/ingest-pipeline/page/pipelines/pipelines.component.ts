import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IngestPipeline } from '../../model/ingest-pipeline';
import { PipelineService } from '../../service/pipeline.service';

@Component({
  selector: 'pipelines',
  templateUrl: './pipelines.component.html',
  styleUrls: ['./pipelines.component.less']
})
export class PipelinesComponent {
  pipelines: Observable<IngestPipeline[]>;

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.pipelines = this.pipelineService.getIngestPipelines();
  }
}
