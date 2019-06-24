import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionService } from './permission.service';

// TODO probably does not need to be exported
@Injectable()
export class UserPermissionService extends PermissionService {
  constructor(private userService: UserService) {
    super();
  }

  getPermissions(): Observable<string[]> {
    return this.userService.getUser().pipe(map(user => user.permissions));
  }
}
