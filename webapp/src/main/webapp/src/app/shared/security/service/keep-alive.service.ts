import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const ResourceRoute = '/api/keep-alive';

/**
 * Use this service to ping the server and keep the user's session alive
 */
@Injectable({
  providedIn: 'root'
})
export class KeepAliveService {
  constructor(private http: HttpClient) {}

  extendSession(): Observable<void> {
    return this.http.get<void>(ResourceRoute);
  }
}
