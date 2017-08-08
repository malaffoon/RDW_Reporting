import { Response } from "@angular/http";
import { Observable } from "rxjs";
/**
 * This class holds common response handling utility methods.
 */
export class ResponseUtils {

  /**
   * Handle a Bad Response codes as a null response.
   * Any other response code is re-thrown.
   *
   * @param response  The response
   * @returns {Observable} A null response for 404, otherwise an error
   */
  static badResponseToNull(response: Response): Observable<Response> {
    if ([ 400, 403, 404 ].indexOf(response.status) !== -1) {
      return Observable.of(null);
    }
    return Observable.throw(response);
  }

  static toNull = (): Observable<any> => Observable.of(null);

}
