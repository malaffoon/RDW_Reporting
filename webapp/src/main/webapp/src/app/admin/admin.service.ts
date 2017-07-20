import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs";
import { isNullOrUndefined } from "util";
import { WarehouseImport } from "./warehouse-import.model";

/**
 * This service is responsible for retrieving sample admin results.
 */
@Injectable()
export class AdminService {

  constructor(private dataService: DataService) {
  }

  findWarehouseImports(): Observable<WarehouseImport[]> {
    return this.dataService
      .get(`/warehouseImports`)
      .map((apiWarehouseImport) => this.mapWarehouseImportsFromApi(apiWarehouseImport));
  }

  private mapWarehouseImportsFromApi(apiWarehouseImport: any[]): WarehouseImport[] {
    if (isNullOrUndefined(apiWarehouseImport)) return [];
    return apiWarehouseImport
      .filter(apiWarehouseImport => !isNullOrUndefined(apiWarehouseImport))
      .map(apiWarehouseImport => this.mapWarehouseImportFromApi(apiWarehouseImport));
  }

  private  mapWarehouseImportFromApi(apiModel: any): WarehouseImport {
    let uiModel = new WarehouseImport();

    uiModel.id = apiModel.id;
    uiModel.digest = apiModel.digest;

    return uiModel;
  }
}
