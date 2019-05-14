import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Pipeline } from '../model/pipeline';
import { PipelineService } from '../service/pipeline.service';

@Injectable({
  providedIn: 'root'
})
export class PipelineResolve implements Resolve<Pipeline> {
  constructor(private service: PipelineService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pipeline> {
    const { id } = route.params;
    return this.service.getPipeline(Number(id));
  }
}
