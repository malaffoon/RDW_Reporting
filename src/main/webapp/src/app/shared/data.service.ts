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

  private get(url): Observable<any> {
    return this.http
      .get(url)
      .map(response => response.json());
  }

  getGroupSummaries(): Observable<Array<Group>> {
    return this.get(`/api/groupSummaries`);
  }

  getGroup(id: number): Observable<Group> {
    return this.get(`/api/groups/${id}/students`);
  }

  getGroupExams(id: number): Observable<Group> {
    return this.get(`/api/groups/${id}/exams`);
  }

  getGroupExamItemWithScore(groupId: number, examId: number, itemId: number, score: number) {
    return this.get(`/api/groups/${groupId}/exams/${examId}/items/${itemId}/score/${score}`);
  }

  getGroupExamItem(groupId: number, examId: number, itemId: number) {
    return this.get(`/api/groups/${groupId}/exams/${examId}/items/${itemId}`);
  }

  getStudentExams(groupId: number, studentId: number): Observable<Group> {
    return this.get(`/api/groups/${groupId}/students/${studentId}/exams`);
  }

  getStudentExam(groupId: number, studentId: number, examId: number): Observable<Group> {
    return this.get(`/api/groups/${groupId}/students/${studentId}/exams/${examId}`);
  }

  getExam(id: number): Observable<Exam> {
    return this.get(`/api/exams/${id}`);
  }

}
