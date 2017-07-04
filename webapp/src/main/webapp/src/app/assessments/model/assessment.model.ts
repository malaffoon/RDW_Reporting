import { AssessmentType } from "../../shared/enum/assessment-type.enum";

export class Assessment {
  id: number;
  name: string;
  grade: number;
  type: AssessmentType;
  subject: string;
  selected: boolean;
  claimCodes: string[];

  get isIab() {
    return this.type == AssessmentType.IAB;
  }

  get isIca() {
    return this.type == AssessmentType.ICA;
  }

  get isInterim() {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative() {
    return this.type == AssessmentType.SUMMATIVE;
  }
}
