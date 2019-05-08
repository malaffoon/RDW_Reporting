import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import {
  CompilationError,
  Pipeline,
  PipelineScript,
  PipelineTest,
  PipelineTestRun
} from '../model/pipeline';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import {
  createFailingTest,
  createPassingTest,
  stubIngestPipelines,
  stubPipelineScript,
  stubPipelineTest,
  stubPipelineTests,
  stubPublishedScripts
} from './pipeline.service.stubs';

let testId: number = stubPipelineTests.length + 1;

function toTestRun(test: PipelineTest, index: number): PipelineTestRun {
  return index < 1 ? createPassingTest(test) : createFailingTest(test);
}

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(private dataService: DataService) {}

  getPipelines(): Observable<Pipeline[]> {
    return of(stubIngestPipelines);
  }

  getPipeline(id: number): Observable<Pipeline> {
    return of(stubIngestPipelines.find(pipeline => pipeline.id === id)).pipe(
      delay(500)
    );
  }

  getPipelineScripts(pipelineId: number): Observable<PipelineScript[]> {
    return of(<PipelineScript[]>[
      {
        ...stubPipelineScript,
        id: 1,
        pipelineId
      }
    ]).pipe(delay(500));
  }

  getPipelineScript(
    pipelineId: number,
    scriptId: number
  ): Observable<PipelineScript> {
    return of(<PipelineScript>{
      ...stubPipelineScript,
      id: scriptId,
      pipelineId
    }).pipe(delay(500));
  }

  getPipelineTests(pipelineId: number): Observable<PipelineTest[]> {
    return of(
      stubPipelineTests.map(test => ({
        ...test,
        pipelineId
      }))
    ).pipe(delay(500));
  }

  getPipelineTest(
    pipelineId: number,
    testId: number
  ): Observable<PipelineTest> {
    return of({
      ...stubPipelineTest,
      id: testId,
      pipelineId
    }).pipe(delay(500));
  }

  createPipelineTest(test: PipelineTest): Observable<PipelineTest> {
    return of({
      id: testId++,
      pipelineId: test.pipelineId,
      createdOn: new Date(),
      name: '',
      input: '',
      output: ''
    }).pipe(delay(500));
  }

  updatePipelineTest(test: PipelineTest): Observable<PipelineTest> {
    return of(test).pipe(delay(500));
  }

  deletePipelineTest(test: PipelineTest): Observable<void> {
    return of(null);
  }

  runPipelineTests(pipelineId: number): Observable<PipelineTestRun[]> {
    return of(stubPipelineTests.map(toTestRun)).pipe(delay(1000));
  }

  runPipelineTest(
    pipelineId: number,
    testId: number
  ): Observable<PipelineTestRun> {
    return of(
      stubPipelineTests.map(toTestRun).find(({ test: { id } }) => id === testId)
    ).pipe(delay(1000));
  }

  compilePipelineScript(scriptBody: string): Observable<CompilationError[]> {
    return of(
      scriptBody.includes('error')
        ? [{ row: 2, column: 0, message: 'Error message' }]
        : []
    ).pipe(delay(1000));
  }

  updatePipelineScript(script: PipelineScript): Observable<PipelineScript> {
    return of(script).pipe(delay(1000));
  }

  publishPipelineScript(pipelineId: number): Observable<void> {
    // should require test and save on the backend
    return of(null).pipe(delay(1000));
  }

  getPublishedPipelineScripts(
    pipelineId: number
  ): Observable<PipelineScript[]> {
    return of(
      stubPublishedScripts.map(
        script => <PipelineScript>{ ...script, pipelineId }
      )
    ).pipe(delay(200));
  }

  getPublishedPipelineScript(
    script: PipelineScript
  ): Observable<PipelineScript> {
    return of(
      stubPublishedScripts
        .map(
          script =>
            <PipelineScript>{
              ...script,
              pipelineId: script.pipelineId
            }
        )
        .find(x => x.id === script.id)
    ).pipe(delay(200));
  }
}
