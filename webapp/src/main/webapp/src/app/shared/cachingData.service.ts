import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class CachingDataService {

  private cache: { [key: string]: any } = {};

  constructor(private http: Http) {
  }

  private get(url: string, options?: RequestOptionsArgs): Observable<any> {
    if(this.cache[url]){
      return this.cache[url]
    }

    let observable = this.http
      .get(`/api${url}`, options)
      .map(response => response.json());

    this.cache[url] = observable;
    return observable;
  }

  public getSchoolYears() {
    return this.get("/schoolyears");
  }
}
