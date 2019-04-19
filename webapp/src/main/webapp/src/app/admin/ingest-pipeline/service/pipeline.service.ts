import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import {
  Pipeline,
  PipelineScript,
  PipelineTest,
  ScriptError
} from '../model/pipeline';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import {
  stubIngestPipelines,
  stubPipelineScript
} from './pipeline.service.stubs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(
    private dataService: DataService,
    private translateService: TranslateService
  ) {}

  getPipelines(): Observable<Pipeline[]> {
    return of(
      stubIngestPipelines.map(pipeline => ({
        ...pipeline,
        name: this.translateService.instant(
          `ingest-pipeline.${pipeline.id}.name`
        ),
        description: this.translateService.instant(
          `ingest-pipeline.${pipeline.id}.description`
        )
      }))
    );
  }

  getPipeline(id: string): Observable<Pipeline> {
    return of(
      stubIngestPipelines
        .map(pipeline => ({
          ...pipeline,
          name: this.translateService.instant(
            `ingest-pipeline.${pipeline.id}.name`
          ),
          description: this.translateService.instant(
            `ingest-pipeline.${pipeline.id}.description`
          )
        }))
        .find(pipeline => pipeline.id === id)
    );
  }

  getPipelineScript(
    pipelineId: string,
    scriptId: number
  ): Observable<PipelineScript> {
    return of(stubPipelineScript);
  }

  getPipelineTests(pipelineId: string): Observable<PipelineTest[]> {
    return of([]);
  }

  getPipelineTest(
    pipelineId: string,
    testId: number
  ): Observable<PipelineTest> {
    return of(<any>{});
  }

  compilePipelineScript(script: string): Observable<ScriptError[]> {
    return of(
      script.includes('error')
        ? [{ row: 2, column: 0, message: { code: 'Error message' } }]
        : []
    ).pipe(delay(1000));
  }

  testPipelineScript(
    pipelineId: string,
    script: string
  ): Observable<ScriptError[]> {
    return of([]);
  }

  savePipelineScript(
    pipelineId: string,
    script: string
  ): Observable<PipelineScript> {
    return of(null);
  }

  publishPipelineScript(
    pipelineId: string,
    script: string
  ): Observable<PipelineScript> {
    // should require test and save on the backend
    return of(null);
  }
}
