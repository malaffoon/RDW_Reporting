import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ResponseContentType } from '@angular/http';
import { AdminServiceRoute } from '../shared/service-route';
import { DataService } from '../shared/data/data.service';
import { ResponseUtils } from '../shared/response-utils';

const ResourceRoute = `${AdminServiceRoute}/config/decrypt`;

/**
 * Service responsible for sandboxes
 */
@Injectable({
  providedIn: 'root'
})
export class DecryptionService {
  constructor(private dataService: DataService) {}

  /**
   * Calls an API that decrypts and encrypted password
   * @param sandbox - The sandbox to create
   */
  decrypt(encryptedPassword: string): Observable<string> {
    return this.dataService
      .post(`${ResourceRoute}`, encryptedPassword, {
        responseType: ResponseContentType.Text
      })
      .pipe(catchError(ResponseUtils.throwError));
  }
}
