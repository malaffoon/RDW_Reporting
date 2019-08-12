import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const ResourceRoute = '/keep-alive';

@Injectable({
  providedIn: 'root'
})
export class KeepAliveService {
  constructor(private http: HttpClient) {}

  extendSession(): Observable<void> {
    return this.http.get<void>(ResourceRoute);
  }
}
