import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipeline } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { PublishedPipelineView } from '../../component/pipeline-published-scripts/pipeline-published-scripts.component';

@Component({
  selector: 'pipeline-publishing-history',
  templateUrl: './pipeline-publishing-history.component.html'
})
export class PipelinePublishingHistoryComponent {
  pipeline: Observable<Pipeline>;
  pipelines: Observable<PublishedPipelineView[]>;
  selectedPipeline: PublishedPipelineView;

  constructor(
    private pipelineService: PipelineService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pipelineId = this.route.params.pipe(map(({ id }) => Number(id)));
    this.pipeline = pipelineId.pipe(
      mergeMap(id => this.pipelineService.getPipeline(id))
    );
    this.pipelines = this.pipeline.pipe(
      mergeMap(pipeline =>
        this.pipelineService.getPublishedPipelines(pipeline.code).pipe(
          map(serverPipelines =>
            serverPipelines.map(serverPipeline => ({
              ...serverPipeline,
              active: pipeline.activeVersion === serverPipeline.version
            }))
          )
        )
      ),
      tap(([first]) => {
        this.selectedPipeline = first;
      })
    );
  }

  onPipelineSelect(pipeline: PublishedPipelineView): void {
    this.selectedPipeline = pipeline;
  }
}
