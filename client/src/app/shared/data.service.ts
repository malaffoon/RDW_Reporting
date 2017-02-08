import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {Assessment} from "./assessment";
import {Group} from "./group";

@Injectable()
export class DataService {

  constructor(private http: Http) {}

  getGroups(): Observable<Array<Group>> {
    return this.http
      .get(`/api/groups`)
      .map(response => response.json());
  }

  getGroup(id: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${id}/students`)
      .map(response => response.json());
  }

  getGroupAssessments(id: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${id}/assessments`)
      .map(response => response.json());
  }

  getStudentAssessments(groupId: string, studentId: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${groupId}/students/${studentId}/assessments`)
      .map(response => response.json());
  }

  getAssessment(id: string): Observable<Assessment> {
    return this.http
      .get(`/api/assessments/${id}`)
      .map(response => response.json());
  }

}
