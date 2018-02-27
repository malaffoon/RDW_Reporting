import { Injectable } from "@angular/core";
import { CachingDataService } from "../data/caching-data.service";
import { EmbargoAlert } from "./embargo-alert";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { catchError } from "rxjs/operators";

@Injectable()
export class EmbargoAlertService {

  constructor(private dataService: CachingDataService) {
  }

  /**
   * Gets the alert status used for indicating whether or not to display the embargo admin alert or not
   *
   * @returns {Observable<EmbargoAlert>}
   */
  getAlert(): Observable<EmbargoAlert> {
    return this.dataService.get('/embargo-alert')
      // fill for backend - if the backend is not there return true by default
      .pipe(catchError(response => of({enabled: true})));
  }

}
