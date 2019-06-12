import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { catchError } from 'rxjs/operators';
import { ResponseUtils } from '../shared/response-utils';
import { Sandbox } from './sandbox';
import { ReportingServiceRoute } from '../shared/service-route';

const ResourceRoute = `${ReportingServiceRoute}/sandboxes`;

/**
 * Service responsible for sandboxes
 */
@Injectable({
  providedIn: 'root'
})
export class SandboxLoginService {
  constructor(private dataService: DataService) {}

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<Sandbox[]> {
    return this.dataService
      .get(`${ResourceRoute}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
