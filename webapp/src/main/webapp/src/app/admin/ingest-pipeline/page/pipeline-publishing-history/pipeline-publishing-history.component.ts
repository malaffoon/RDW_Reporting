import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipeline, PipelineScript } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'pipeline-publishing-history',
  templateUrl: './pipeline-publishing-history.component.html'
})
export class PipelinePublishingHistoryComponent {
  pipeline: Observable<Pipeline>;
  scripts: Observable<PipelineScript[]>;
  selectedScript: PipelineScript;

  constructor(
    private pipelineService: PipelineService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pipelineId = this.route.params.pipe(
      map(({ id }) => Number(id)),
      share()
    );
    this.pipeline = pipelineId.pipe(
      mergeMap(id => this.pipelineService.getPipeline(id))
    );
    this.scripts = pipelineId.pipe(
      mergeMap(id => this.pipelineService.getPublishedPipelineScripts(id))
    );
  }

  onScriptSelect(script: PipelineScript): void {
    this.selectedScript = script;
  }
}
