import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipeline, PipelineScript } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';

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
    const pipelineId = this.route.params.pipe(map(({ id }) => Number(id)));
    this.pipeline = pipelineId.pipe(
      mergeMap(id => this.pipelineService.getPipeline(id))
    );
    this.scripts = pipelineId.pipe(
      mergeMap(id => this.pipelineService.getPublishedPipelineScripts(id)),
      tap(scripts => {
        this.selectedScript = scripts[0];
      })
    );
  }

  onScriptSelect(script: PipelineScript): void {
    this.selectedScript = script;
  }
}
