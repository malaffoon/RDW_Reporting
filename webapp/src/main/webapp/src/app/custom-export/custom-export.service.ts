import { Observable } from "rxjs/Observable";
import { DataService } from "../shared/data/data.service";
import { Injectable } from "@angular/core";
import { ResponseContentType } from "@angular/http";
import { ResponseUtils } from "../shared/response-utils";

@Injectable()
export class CustomExportService {

  constructor(private dataService: DataService){}

  createExport(request: CustomExportRequest): Observable<void> {
    return this.dataService.post('/customExport', request, <any>{
      headers: new Headers({ 'Accept': 'application/csv', }),
      responseType: ResponseContentType.Blob
    }).catch(ResponseUtils.throwError);
  }

}

/**
 * Represents custom export request and holds different exam result filter options
 */
export interface CustomExportRequest {

  /**
   * School year to filter on
   */
  readonly schoolYear: number;

  /**
   * District IDs to filter on
   */
  readonly districts?: number[];

  /**
   * School group IDs to filter on
   */
  readonly schoolGroups?: number[];

  /**
   * School IDs to filter on
   */
  readonly schools?: number[];

}
