import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import { IngestPipeline } from '../model/ingest-pipeline';
import { of } from 'rxjs/internal/observable/of';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { delay } from 'rxjs/operators';
import { InputType } from '../model/input-type';

const StubIngestPipelines: IngestPipeline[] = <IngestPipeline[]>[
  {
    id: 1,
    name: 'Exams',
    description: `
    Readymade air plant direct trade flexitarian tousled,
    shabby chic hot chicken raclette pitchfork vinyl.
    Gentrify banjo live-edge, air plant vexillologist
    green juice readymade asymmetrical locavore fingerstache
    master cleanse roof party enamel pin tote bag pinterest.
    `,
    updatedOn: new Date(),
    updatedBy: 'Readymade air plant',
    inputType: 'xml'
  },
  {
    id: 2,
    name: 'Assessments',
    description: `
    Hexagon blue bottle whatever plaid asymmetrical forage deep v disrupt 8-bit.
    Small batch deep v four loko helvetica, fashion axe pork belly vexillologist.
    Bicycle rights meh shoreditch try-hard, hammock typewriter fixie four loko
    shabby chic. Pour-over kitsch pinterest heirloom tousled tacos actually
    hell of vice pitchfork bushwick brunch.
    `,
    updatedOn: new Date(),
    updatedBy: 'Hexagon Blue',
    inputType: 'xml'
  },
  {
    id: 3,
    name: 'Groups',
    description: `
    Shaman raw denim umami deep v wayfarers mumblecore, try-hard williamsburg
    la croix affogato fam narwhal selfies. Tote bag organic narwhal health
    goth hella activated charcoal. Raclette post-ironic 8-bit echo park wolf celiac..
    `,
    updatedOn: new Date(),
    updatedBy: 'Hexagon Blue',
    inputType: 'xml'
  }
].sort(ordering(byString).on(({ name }) => name).compare);

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(private dataService: DataService) {}

  getIngestPipelines(): Observable<IngestPipeline[]> {
    return of(StubIngestPipelines);
  }

  getIngestPipeline(id: number): Observable<IngestPipeline> {
    return of({
      ...StubIngestPipelines.find(pipeline => pipeline.id === id),
      script: {
        id,
        language: 'groovy',
        body: `def scriptId = ${id}\n`
      }
    });
  }

  getInputSamples(value: InputType): Observable<any[]> {
    return of([
      {
        name: 'TRT A'
      },
      {
        name: 'TRT B'
      }
    ]);
  }

  compileScript(value: string): Observable<any[]> {
    return of(
      value.includes('error') ? [{ type: 'error', raw: 'Error message' }] : []
    ).pipe(delay(1000));
  }
}
