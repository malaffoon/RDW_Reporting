import { Observable } from "rxjs";
import { Assessment } from "./model/assessment.model";
import { Exam } from "./model/exam.model";
import { AssessmentItem } from "./model/assessment-item.model";

export interface AssessmentProvider{
  getAvailableAssessments(): Observable<Assessment[]>;
  getExams(assessmentId: number): Observable<Exam[]>;
  getAssessmentItems(assessmentId: number): Observable<AssessmentItem[]>;
}
