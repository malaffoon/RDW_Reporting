import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import {
  CompilationError,
  Pipeline,
  PipelineScript,
  PipelineTest,
  PipelineTestResult
} from '../model/pipeline';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import {
  createFailingTest,
  createPassingTest,
  stubIngestPipelines,
  stubPipelineScript,
  stubPipelineTest,
  stubPipelineTests
} from './pipeline.service.stubs';
import { TranslateService } from '@ngx-translate/core';

let testId: number = stubPipelineTests.length + 1;

function toTest(test: PipelineTest, index: number): PipelineTest {
  return index < 1 ? createPassingTest(test) : createFailingTest(test);
}

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
    ).pipe(delay(500));
  }

  getPipelineScript(
    pipelineId: string,
    scriptId: number
  ): Observable<PipelineScript> {
    return of(stubPipelineScript).pipe(delay(500));
  }

  getPipelineTests(pipelineId: string): Observable<PipelineTest[]> {
    return of(stubPipelineTests).pipe(delay(500));
  }

  getPipelineTest(
    pipelineId: string,
    testId: number
  ): Observable<PipelineTest> {
    return of(stubPipelineTest).pipe(delay(500));
  }

  createPipelineTest(
    pipelineId: string,
    test: PipelineTest
  ): Observable<PipelineTest> {
    return of({
      id: testId++,
      createdOn: new Date(),
      name: '',
      input: '',
      output: ''
    }).pipe(delay(500));
  }

  updatePipelineTest(
    pipelineId: string,
    test: PipelineTest
  ): Observable<PipelineTest> {
    return of(test).pipe(delay(500));
  }

  deletePipelineTest(pipelineId: string, testId: number): Observable<void> {
    return of(null);
  }

  runPipelineTest(
    pipelineId: string,
    testId: number,
    scriptBody: string
  ): Observable<PipelineTest[]> {
    return of(
      stubPipelineTests.map(toTest).filter(({ id }) => id === testId)
    ).pipe(delay(1000));
  }

  runPipelineTests(
    pipelineId: string,
    scriptBody: string
  ): Observable<PipelineTest[]> {
    return of(stubPipelineTests.map(toTest)).pipe(delay(1000));
  }

  compilePipelineScript(scriptBody: string): Observable<CompilationError[]> {
    return of(
      scriptBody.includes('error')
        ? [{ row: 2, column: 0, message: { code: 'Error message' } }]
        : []
    ).pipe(delay(1000));
  }

  updatePipelineScript(
    pipelineId: string,
    script: PipelineScript
  ): Observable<PipelineScript> {
    return of(script).pipe(delay(1000));
  }

  publishPipelineScript(
    pipelineId: string,
    script: PipelineScript
  ): Observable<PipelineScript> {
    // should require test and save on the backend
    return of(script).pipe(delay(1000));
  }
}
