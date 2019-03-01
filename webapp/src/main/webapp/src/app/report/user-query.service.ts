import { Injectable } from '@angular/core';
import { ReportQuery, UserQuery } from './report';
import { DataService } from '../shared/data/data.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserQueryService {

  constructor(private dataService: DataService) {
  }

  getQueries(): Observable<UserQuery[]> {
    return null;
  }

  createQuery(query: ReportQuery): Observable<UserQuery> {
    return null;
  }

  updateQuery(query: UserQuery): Observable<UserQuery> {
    return null;
  }

  deleteQuery(id: number): Observable<void> {
    return null;
  }

}
