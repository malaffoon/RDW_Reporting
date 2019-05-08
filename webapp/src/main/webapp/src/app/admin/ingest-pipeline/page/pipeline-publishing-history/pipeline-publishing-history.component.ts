import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipeline, PipelineScript } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'pipeline-publishing-history',
  templateUrl: './pipeline-publishing-history.component.html'
})
export class PipelinePublishingHistoryComponent {
  pipeline: Pipeline;
  scripts: Observable<PipelineScript[]>;
  selectedScript: PipelineScript;

  constructor(
    private pipelineService: PipelineService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const { pipeline } = this.route.snapshot.data;
    this.pipeline = pipeline;
    this.scripts = this.pipelineService.getPublishedScripts().pipe(
      tap(scripts => {
        if (scripts.length > 0) {
          this.selectedScript = scripts[0];
        }
      })
    );
  }

  onScriptSelect(script: PipelineScript): void {
    this.selectedScript = script;
  }
}
