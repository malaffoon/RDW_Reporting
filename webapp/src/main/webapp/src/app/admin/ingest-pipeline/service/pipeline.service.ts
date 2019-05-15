import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import {
  Pipeline,
  PipelineScript,
  PipelineTest,
  PipelineTestRun,
  ScriptError
} from '../model/pipeline';
import { catchError, map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';
import { of } from 'rxjs/internal/observable/of';

const ResourceRoute = `${AdminServiceRoute}/pipelines`;

const emptyPipelineScript = {
  body: '',
  language: 'groovy'
};

function toPipelineScript(serverScript: any): PipelineScript {
  return {
    id: serverScript.id,
    pipelineId: serverScript.pipelineId,
    body: serverScript.body,
    language: 'groovy',
    createdOn: new Date(serverScript.created),
    updatedOn: new Date(serverScript.updated),
    updatedBy: serverScript.updatedBy
  };
}

function toPublishedPipelineScript(serverScript: any): PipelineScript {
  return {
    id: serverScript.id,
    pipelineId: serverScript.pipelineId,
    body: serverScript.body,
    language: 'groovy',
    createdOn: new Date(serverScript.created),
    updatedOn: new Date(serverScript.updated),
    updatedBy: serverScript.updatedBy,
    published: true,
    publishedOn: new Date(serverScript.published),
    publishedBy: serverScript.publishedBy
  };
}

function toPipelineTest(serverTest: any): PipelineTest {
  return {
    id: serverTest.id,
    pipelineId: serverTest.pipelineId,
    name: serverTest.name,
    input: serverTest.input,
    output: serverTest.output,
    createdOn: new Date(serverTest.created),
    updatedOn: new Date(serverTest.updated),
    updatedBy: serverTest.updatedBy
  };
}

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(private dataService: DataService) {}

  getPipelines(): Observable<Pipeline[]> {
    return this.dataService.get(ResourceRoute);
  }

  getPipeline(pipelineId: number): Observable<Pipeline> {
    return this.getPipelines().pipe(
      map(pipelines => pipelines.find(({ id }) => id === pipelineId))
    );
  }

  getPipelineScripts(pipelineId: number): Observable<PipelineScript[]> {
    return this.dataService.get(`${ResourceRoute}/${pipelineId}/scripts`).pipe(
      map(serverScripts =>
        serverScripts.length > 0
          ? serverScripts.map(toPipelineScript)
          : [
              {
                ...emptyPipelineScript,
                pipelineId
              }
            ]
      )
    );
  }

  getPipelineScript(
    pipelineId: number,
    scriptId: number
  ): Observable<PipelineScript> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/scripts/${scriptId}`)
      .pipe(
        map(toPipelineScript),
        catchError(() =>
          of({
            ...emptyPipelineScript,
            pipelineId
          })
        )
      );
  }

  createPipelineScript(script: PipelineScript): Observable<PipelineScript> {
    return this.dataService
      .post(`${ResourceRoute}/${script.pipelineId}/scripts`, script)
      .pipe(map(toPipelineScript));
  }

  updatePipelineScript(script: PipelineScript): Observable<PipelineScript> {
    return this.dataService
      .put(`${ResourceRoute}/${script.pipelineId}/scripts`, script)
      .pipe(map(toPipelineScript));
  }

  getPipelineTests(pipelineId: number): Observable<PipelineTest[]> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/tests`)
      .pipe(map(serverScripts => serverScripts.map(toPipelineTest)));
  }

  getPipelineTest(
    pipelineId: number,
    testId: number
  ): Observable<PipelineTest> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/tests/${testId}`)
      .pipe(map(toPipelineTest));
  }

  createPipelineTest(test: PipelineTest): Observable<PipelineTest> {
    return this.dataService
      .post(`${ResourceRoute}/${test.pipelineId}/tests`, test)
      .pipe(map(toPipelineTest));
  }

  updatePipelineTest(test: PipelineTest): Observable<PipelineTest> {
    return this.dataService
      .put(`${ResourceRoute}/${test.pipelineId}/tests`, test)
      .pipe(map(toPipelineTest));
  }

  deletePipelineTest(test: PipelineTest): Observable<void> {
    return this.dataService.delete(
      `${ResourceRoute}/${test.pipelineId}/tests/${test.id}`
    );
  }

  runPipelineTests(pipelineId: number): Observable<PipelineTestRun[]> {
    return this.dataService.post(`${ResourceRoute}/${pipelineId}/test`, null);
  }

  runPipelineTest(
    pipelineId: number,
    testId: number
  ): Observable<PipelineTestRun> {
    return this.dataService.post(`${ResourceRoute}/${pipelineId}/test`, null, {
      params: {
        testId
      }
    });
  }

  compilePipelineScript(scriptBody: string): Observable<ScriptError[]> {
    return this.dataService
      .post(`${ResourceRoute}/compile`, scriptBody)
      .pipe(catchError(() => of([])));
  }

  publishPipelineScript(pipelineId: number): Observable<String> {
    return this.dataService.post(
      `${ResourceRoute}/${pipelineId}/publish`,
      null
    );
  }

  getPublishedPipelineScripts(
    pipelineId: number
  ): Observable<PipelineScript[]> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/publishedScripts`)
      .pipe(map(serverScripts => serverScripts.map(toPublishedPipelineScript)));
  }

  getPublishedPipelineScript(
    script: PipelineScript
  ): Observable<PipelineScript> {
    return this.dataService
      .get(
        `${ResourceRoute}/${script.pipelineId}/publishedScripts/${script.id}`
      )
      .pipe(map(toPublishedPipelineScript));
  }
}
