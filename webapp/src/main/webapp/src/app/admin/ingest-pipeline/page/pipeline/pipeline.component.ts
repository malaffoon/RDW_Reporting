import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { PipelineService } from '../../service/pipeline.service';
import { IngestPipeline } from '../../model/ingest-pipeline';

@Component({
  selector: 'pipeline',
  templateUrl: './pipeline.component.html'
})
export class PipelineComponent {
  pipeline: Observable<IngestPipeline>;

  constructor(
    private route: ActivatedRoute,
    private pipelineService: PipelineService
  ) {}

  ngOnInit(): void {
    this.pipeline = this.route.params.pipe(
      mergeMap(({ id }) => this.pipelineService.getIngestPipeline(Number(id)))
    );
  }
}
