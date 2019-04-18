import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { IngestPipeline } from '../model/ingest-pipeline';
import { PipelineService } from '../service/pipeline.service';

@Injectable({
  providedIn: 'root'
})
export class PipelineResolve implements Resolve<IngestPipeline> {
  constructor(private service: PipelineService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IngestPipeline> {
    const { id } = route.params;
    return this.service.getIngestPipeline(Number(id));
  }
}
