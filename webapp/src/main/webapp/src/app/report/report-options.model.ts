import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";

export class ReportOptions {

  public assessmentType: AssessmentType;
  public subject: AssessmentSubjectType;
  public schoolYear: number;
  public language: string;
  public grayscale: boolean;

}
