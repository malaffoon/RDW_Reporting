import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {environment} from "../../environments/environment";

@Injectable()
export class AssessmentService {

  constructor(private http: Http) {
  }

  getAssessment(id: string): Observable<Object> {
    return this.http
      .get(`${environment.apiURL}/assessments/${id}`, new Headers({
        'Content-Type': 'application/json'
      }))
      .map(response => response.json())
      .catch(error => Observable.throw(error.json().error || 'Server error'));
  }

  getAssessmentsByStudents(): Observable<Object[]> {
    return this.http
      .get(`${environment.apiURL}/students`, new Headers({
        'Content-Type': 'application/json'
      }))
      .map(response => response.json())
      .catch(error => Observable.throw(error.json().error || 'Server error'));
  }

}
