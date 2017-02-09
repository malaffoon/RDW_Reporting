import {Item} from "./item";
import {AssessmentType} from "./assessment-type.enum";
import {AssessmentSubjectType} from "./assessment-subject-type.enum";

export interface Assessment {

  readonly id: number;
  readonly type: AssessmentType;
  readonly name: string;
  readonly academicYear: number;
  readonly grade: number;
  readonly subject: AssessmentSubjectType;
  readonly items?: Array<Item>;

}
