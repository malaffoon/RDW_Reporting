import { AssessmentType } from "../../shared/enum/assessment-type.enum";

export class Assessment {
  id: number;
  name: string;
  grade: number;
  type: AssessmentType;
  subject: string;
  selected: boolean;

  get isIab() {
    return this.type == AssessmentType.IAB;
  }

  get isInterim() {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative() {
    return this.type == AssessmentType.SUMMATIVE;
  }

  // TODO: change to use enum and have ID returned instead of string
  get isMath() {
    return this.subject == 'MATH';
  }

  get isEla() {
    return this.subject == 'ELA';
  }
}
