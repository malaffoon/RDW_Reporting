import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class GroupService {

  constructor(private http: Http) {
  }

  getGroups(): Observable<Array<Object>> {
    return this.http
      .get(`/api/groups`)
      .map(response => response.json())
      .catch(error => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }

  getGroup(id: string): Observable<Object> {
    return this.http
      .get(`/api/groups/${id}`)
      .map(response => response.json())
      .catch(error => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }

}
