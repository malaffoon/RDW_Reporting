import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ResponseUtils } from '../../shared/response-utils';
import { Sandbox } from '../model/sandbox';
import { DataService } from '../../shared/data/data.service';

const ResourceRoute = `/sandboxes`;

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
