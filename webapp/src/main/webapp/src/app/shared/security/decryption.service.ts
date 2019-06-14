import { Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { AdminServiceRoute } from '../service-route';
import { ResponseUtils } from '../response-utils';
import { DataService } from '../data/data.service';
import { ResponseContentType } from '@angular/http';

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
    const httpOptions = {
      responseType: 'text' as 'text'
    };
    return this.dataService
      .post(`${ResourceRoute}`, encryptedPassword, {
        responseType: ResponseContentType.Text
      })
      .pipe(catchError(ResponseUtils.throwError));
  }
}
