import { AssessmentProvider } from '../../assessments/assessment-provider.interface';
import { Observable } from 'rxjs';
import { AssessmentItem } from '../../assessments/model/assessment-item.model';
import { Exam } from '../../assessments/model/exam';
import { GroupAssessmentService, Search } from './group-assessment.service';
import { Assessment } from '../../assessments/model/assessment';

export interface StateProvider {
  group: { id; schoolId? };
  schoolYear: number;
}

export class GroupAssessmentProvider implements AssessmentProvider {
  constructor(
    private service: GroupAssessmentService,
    private stateProvider: StateProvider
  ) {}

  getAssessmentItems(
    assessmentId: number,
    types?: string[]
  ): Observable<AssessmentItem[]> {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getAssessmentItems(
      this.addGroup({ schoolYear, assessmentId, types }, group)
    );
  }

  getAvailableAssessments(): Observable<Assessment[]> {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getAvailableAssessments(
      this.addGroup({ schoolYear }, group)
    );
  }

  getExams(assessmentId: number): Observable<Exam[]> {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getExams(
      this.addGroup({ schoolYear, assessmentId }, group)
    );
  }

  getTargetScoreExams(assessmentId: number) {
    const { group, schoolYear } = this.stateProvider;
    return this.service.getTargetScoreExams(
      this.addGroup({ schoolYear, assessmentId }, group)
    );
  }

  getSchoolId(): number {
    return this.stateProvider.group.schoolId;
  }

  private addGroup<T extends Search>(search: T, group): T {
    if (group.userCreated) {
      search.userGroupId = group.id;
    } else {
      search.groupId = group.id;
    }
    return search;
  }
}
