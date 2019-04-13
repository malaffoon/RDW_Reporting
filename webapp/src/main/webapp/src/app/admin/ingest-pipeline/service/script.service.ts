import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IngestPipelineScript } from '../model/script';
import { DataService } from '../../../shared/data/data.service';
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';
import { of } from 'rxjs/internal/observable/of';

const ResourceRoute = `${AdminServiceRoute}/ingestPipelineScripts`;

function toIngestPipelineScript(serverScript: any): IngestPipelineScript {
  return serverScript;
}

const StubScripts: IngestPipelineScript[] = [
  {
    id: 1,
    name: 'Script 1',
    language: 'groovy',
    body: `
def scriptName = 'Script 1'
`,
    index: 0
  },
  {
    id: 2,
    name: 'Script 2',
    language: 'groovy',
    body: `
def scriptName = 'Script 2'
`
  }
];

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  constructor(private dataService: DataService) {}

  getScripts(): Observable<IngestPipelineScript[]> {
    // return this.dataService.get(ResourceRoute).pipe(
    //   map(serverScripts => serverScripts.map(toIngestPipelineScript))
    // );
    return of(StubScripts);
  }

  getScript(id: number): Observable<IngestPipelineScript> {
    return of(StubScripts.find(script => script.id === id));
  }
}
