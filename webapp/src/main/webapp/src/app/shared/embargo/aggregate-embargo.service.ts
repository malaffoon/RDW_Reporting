import { Injectable } from "@angular/core";
import { CachingDataService } from "../data/caching-data.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { catchError } from "rxjs/operators";
import { AggregateServiceRoute } from "../service-route";

@Injectable()
export class AggregateEmbargoService {

  constructor(private dataService: CachingDataService) {
  }

  /**
   * Gets user organization exam embargo status
   *
   * @returns {Observable<boolean>}
   */
  isEmbargoed(): Observable<boolean> {
    return this.dataService.get(`${AggregateServiceRoute}/user-organizations/embargoed`)
      // fill for backend - if the backend is not there return true by default
      .pipe(catchError(response => of({enabled: true})));
  }

}
