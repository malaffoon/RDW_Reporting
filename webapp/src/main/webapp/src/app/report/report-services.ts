import { ReportQuery, UserQuery, UserReport } from './report';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserReportService } from './user-report.service';
import { UserQueryService } from './user-query.service';

/**
 * Takes route query parameters and required services and returns a query source.
 *
 * @param queryParams The route query parameters
 * @param userReportService The user report service
 * @param userQueryService The user query service
 */
export function getQueryFromRouteQueryParameters<T extends ReportQuery>(
  queryParams: { [param: string]: string },
  userReportService: UserReportService,
  userQueryService: UserQueryService
): Observable<T> {
  const { userReportId, userQueryId } = queryParams;
  if (userReportId == null && userQueryId == null) {
    return of(undefined);
  }
  const source: Observable<UserReport | UserQuery> =
    userReportId != null
      ? userReportService.getReport(Number.parseInt(userReportId))
      : userQueryService.getQuery(Number.parseInt(userQueryId));

  return source.pipe(map(({ query }) => <T>query));
}
