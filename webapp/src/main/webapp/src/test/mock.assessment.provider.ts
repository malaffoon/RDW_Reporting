import { Observable, of } from 'rxjs';
import { AssessmentItem } from '../app/assessments/model/assessment-item.model';
import { Exam } from '../app/assessments/model/exam';
import { Assessment } from '../app/assessments/model/assessment';
import { AssessmentProvider } from '../app/assessments/assessment-provider.interface';
import { TargetScoreExam } from '../app/assessments/model/target-score-exam.model';

export class MockAssessmentProvider implements AssessmentProvider {
  getAvailableAssessments(): Observable<Assessment[]> {
    return of([]);
  }

  getExams(assessmentId: number): Observable<Exam[]> {
    return of([]);
  }

  getAssessmentItems(assessmentId: number): Observable<AssessmentItem[]> {
    return of([]);
  }

  getTargetScoreExams(assessmentId: number): Observable<TargetScoreExam[]> {
    return of([]);
  }

  getSchoolId() {
    return null;
  }
}
