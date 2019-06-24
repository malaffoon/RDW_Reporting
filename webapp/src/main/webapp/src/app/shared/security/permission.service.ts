import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Null permission service placeholder.
 * This should be overridden with a permission service that provides the user permissions
 */
@Injectable()
export abstract class PermissionService {
  /**
   * Gets the user permissions
   *
   * @returns {Observable<string[]>} array of permission identifiers
   */
  abstract getPermissions(): Observable<string[]>;
}
