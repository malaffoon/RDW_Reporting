import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { IngestPipelineScript } from '../model/script';
import { ScriptService } from '../service/script.service';

@Injectable({
  providedIn: 'root'
})
export class ScriptResolve implements Resolve<IngestPipelineScript> {
  constructor(private service: ScriptService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IngestPipelineScript> {
    const { id } = route.params;
    return this.service.getScript(Number(id));
  }
}
