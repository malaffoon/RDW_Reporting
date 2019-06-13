import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AdminServiceRoute } from '../service-route';
import { ResponseUtils } from '../response-utils';
import { DataService } from '../data/data.service';

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
      .post(`${ResourceRoute}`, encryptedPassword)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
