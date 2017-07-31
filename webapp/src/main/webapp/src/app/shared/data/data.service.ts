import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { CachingDataService } from "../cachingData.service";

// TODO: Break out methods from DataService so only a public generic Get.
// TODO: Other methods such as getGroups belong in their own service such as GroupService
@Injectable()
export class DataService {

  constructor(private http: Http, private staticDataService: CachingDataService) {
  }

  get(url, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`/api${url}`, options)
      .map(response => response.json());
  }

  getGroups(): Observable<Array<any>> {
    return this.get(`/groups`);
  }
}
