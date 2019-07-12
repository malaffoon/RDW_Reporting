import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../state/user';
import { CachingDataService } from '../../data/caching-data.service';

const UnauthenticatedUser = of({
  firstName: '',
  lastName: '',
  permissions: [],
  logoutUrl: '/logout',
  anonymous: true
});

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private dataService: CachingDataService) {}

  getUser(): Observable<User> {
    return this.dataService.get('/user').pipe(
      map(serverUser => ({
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        permissions: serverUser.permissions,
        anonymous: serverUser.anonymous,
        logoutUrl: serverUser.tenant.logoutUrl,
        sessionRefreshUrl: serverUser.tenant.sessionRefreshUrl,
        sandboxUser: serverUser.tenant.sandbox
      })),
      catchError(() => UnauthenticatedUser)
    );
  }
}
