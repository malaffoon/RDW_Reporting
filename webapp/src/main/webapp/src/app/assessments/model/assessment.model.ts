import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { isNullOrUndefined } from "util";
import { AssessmentSubjectType } from "../../shared/enum/assessment-subject-type.enum";

export class Assessment {
  id: number;
  name: string;
  resourceUrl: string;
  grade: string;
  type: AssessmentType;
  selected: boolean;
  subject: string;
  claimCodes: string[];
  cutPoints: number[];

  get assessmentSubjectType(): AssessmentSubjectType {
    return AssessmentSubjectType[this.subject];
  }

  get hasResourceUrl(): boolean {
    return !isNullOrUndefined(this.resourceUrl);
  }

  get isIab(): boolean {
    return this.type == AssessmentType.IAB;
  }

  get isIca(): boolean {
    return this.type == AssessmentType.ICA;
  }

  get isInterim(): boolean {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative(): boolean {
    return this.type == AssessmentType.SUMMATIVE;
  }
}
