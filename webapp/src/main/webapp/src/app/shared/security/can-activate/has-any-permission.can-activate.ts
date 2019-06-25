import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from '../service/security.service';

/**
 * Allows access to a route if a user has at least one of the permissions in ActivatedRouteSnapshot.data.permissions.
 */
@Injectable({
  providedIn: 'root'
})
export class HasAnyPermissionCanActivate implements CanActivate {
  constructor(private service: SecurityService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const { permissions } = route.data;
    return this.service.checkHasAnyPermission(permissions);
  }
}
