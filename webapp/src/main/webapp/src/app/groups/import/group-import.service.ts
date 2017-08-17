import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { isNullOrUndefined } from "util";
import { StudentGroupBatch } from "./student-group-batch.model";
import { DataService } from "../../shared/data/data.service";

/**
 * This service is responsible for retrieving student group batches
 */
@Injectable()
export class GroupImportService {

  constructor(private dataService: DataService) {
  }

  findStudentGroupBatches(): Observable<StudentGroupBatch[]> {
    return this.dataService
      .get(`/studentGroupBatches`)
      .map((apiStudentGroupBatch) => this.mapWarehouseImportsFromApi(apiStudentGroupBatch));
  }

  mapStudentGroupBatchFromApi(apiModel: any): StudentGroupBatch {
    let uiModel = new StudentGroupBatch();
    uiModel.id = apiModel.id;
    uiModel.digest = apiModel.digest;
    uiModel.message = apiModel.message;
    uiModel.created = apiModel.created;
    uiModel.updated = apiModel.updated;
    uiModel.status = apiModel.status;
    return uiModel;
  }

  private mapWarehouseImportsFromApi(apiStudentGroupBatch: any[]): StudentGroupBatch[] {
    if (isNullOrUndefined(apiStudentGroupBatch)) return [];
    return apiStudentGroupBatch
      .filter(apiStudentGroupBatch => !isNullOrUndefined(apiStudentGroupBatch))
      .map(apiStudentGroupBatch => this.mapStudentGroupBatchFromApi(apiStudentGroupBatch));
  }
}
