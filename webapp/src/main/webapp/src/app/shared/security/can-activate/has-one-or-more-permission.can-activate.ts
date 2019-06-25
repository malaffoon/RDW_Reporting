import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from '../service/security.service';

/**
 * Allows access to a route as long as the permissions are not empty.
 */
@Injectable({
  providedIn: 'root'
})
export class HasOneOrMorePermissionCanActivate implements CanActivate {
  constructor(private service: SecurityService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.service.checkHasOneOrMorePermission();
  }
}
