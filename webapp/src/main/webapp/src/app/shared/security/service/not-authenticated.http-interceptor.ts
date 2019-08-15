import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityService } from './security.service';

/**
 * Intercepts API responses with HTTP 401 and redirects the user to the session expired page when detected
 *
 * This eventually should replace the {@link AuthenticatedHttpService}
 */
@Injectable()
export class NotAuthenticatedHttpInterceptor implements HttpInterceptor {
  constructor(private service: SecurityService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.service.expireSession();
        }
        return throwError(error);
      })
    );
  }
}
