import { AssessmentProvider } from '../../assessments/assessment-provider.interface';
import { Observable } from 'rxjs/Observable';
import { AssessmentItem } from '../../assessments/model/assessment-item.model';
import { Exam } from '../../assessments/model/exam.model';
import { GroupAssessmentService } from './group-assessment.service';
import { Assessment } from '../../assessments/model/assessment.model';

export interface StateProvider {
  group: { id, schoolId? };
  schoolYear: number;
}

export class GroupAssessmentProvider implements AssessmentProvider {

  constructor(private service: GroupAssessmentService,
              private stateProvider: StateProvider) {
  }

  getAssessmentItems(assessmentId: number, itemTypes?: string[]): Observable<AssessmentItem[]> {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getAssessmentItems({groupId: group.id, schoolYear, assessmentId, itemTypes});
  }

  getAvailableAssessments(): Observable<Assessment[]> {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getAvailableAssessments({groupId: group.id, schoolYear});
  }

  getExams(assessmentId: number): Observable<Exam[]> {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getExams({groupId: group.id, schoolYear, assessmentId});
  }

  getSchoolId(): number {
    return this.stateProvider.group.schoolId;
  }

}
