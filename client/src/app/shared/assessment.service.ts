import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class AssessmentService {

  constructor(private http: Http) {
  }

  getAssessment(id: string): Observable<Object> {
    return this.http
      .get(`/api/assessments/${id}`, new Headers({
        'Content-Type': 'application/json'
      }))
      .map(response => response.json())
      .catch(error => Observable.throw(error.json().error || 'Server error'));
  }

  getAssessmentsByStudents(): Observable<Object[]> {
    return this.http
      .get(`/api/students`, new Headers({
        'Content-Type': 'application/json'
      }))
      .map(response => response.json())
      .catch(error => Observable.throw(error.json().error || 'Server error'));
  }

}
