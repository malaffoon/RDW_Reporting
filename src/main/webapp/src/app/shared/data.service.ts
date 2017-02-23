import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {Exam} from "./exam";
import {Group} from "./group";

@Injectable()
export class DataService {

  constructor(private http: Http) {}

  getGroupSummaries(): Observable<Array<Group>> {
    return this.http
      .get(`/api/groupSummaries`)
      .map(response => response.json());
  }

  getGroup(id: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${id}/students`)
      .map(response => response.json());
  }

  getGroupExams(id: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${id}/exams`)
      .map(response => response.json());
  }

  getStudentExams(groupId: string, studentId: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${groupId}/students/${studentId}/exams`)
      .map(response => response.json());
  }

  getStudentExam(groupId: string, studentId: string, examId: string): Observable<Group> {
    return this.http
      .get(`/api/groups/${groupId}/students/${studentId}/exams/${examId}`)
      .map(response => response.json());
  }

  getExam(id: string): Observable<Exam> {
    return this.http
      .get(`/api/exams/${id}`)
      .map(response => response.json());
  }

}
