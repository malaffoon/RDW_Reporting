import { Injectable } from '@angular/core';
import { ReportQuery, UserQuery } from './report';
import { DataService } from '../shared/data/data.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseUtils } from '../shared/response-utils';
import { ReportProcessorServiceRoute } from '../shared/service-route';

const ServiceRoute = `${ReportProcessorServiceRoute}/queries`;
const toUserQuery = serverQuery => serverQuery;

@Injectable()
export class UserQueryService {
  constructor(private dataService: DataService) {}

  getQueries(): Observable<UserQuery[]> {
    return this.dataService.get(ServiceRoute).pipe(
      map(serverQueries => serverQueries.map(toUserQuery)),
      catchError(ResponseUtils.throwError)
    );
  }

  getQuery(id: number): Observable<UserQuery> {
    return this.dataService.get(`${ServiceRoute}/${id}`).pipe(
      map(toUserQuery),
      catchError(ResponseUtils.throwError)
    );
  }

  createQuery(query: ReportQuery): Observable<UserQuery> {
    return this.dataService.post(ServiceRoute, query).pipe(
      map(toUserQuery),
      catchError(ResponseUtils.throwError)
    );
  }

  updateQuery(query: UserQuery): Observable<UserQuery> {
    return this.dataService.put(ServiceRoute, query).pipe(
      map(toUserQuery),
      catchError(ResponseUtils.throwError)
    );
  }

  deleteQuery(id: number): Observable<void> {
    return this.dataService
      .delete(`${ServiceRoute}/${id}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
