import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { CachingDataService } from '../shared/data/caching-data.service';
import { catchError, map } from 'rxjs/operators';

const UnauthenticatedUser = of({
  firstName: '',
  lastName: '',
  permissions: [],
  logoutUrl: '/logout',
  anonymous: true
});

@Injectable()
export class UserService {
  constructor(private dataService: CachingDataService) {}

  getUser(): Observable<User> {
    return this.dataService.get('/user').pipe(
      map(serverUser => ({
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        permissions: serverUser.permissions,
        anonymous: serverUser.anonymous,
        logoutUrl: serverUser.logoutUrl,
        sessionRefreshUrl: serverUser.sessionRefreshUrl
      })),
      catchError(() => UnauthenticatedUser)
    );
  }
}
