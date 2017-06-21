import { byString, byNumber, join } from "@kourge/ordering/comparator";
import { Assessment } from "./model/assessment.model";

export class AssessmentComparator {
  static byGrade = (assessment1: Assessment, assessment2: Assessment) => byNumber(assessment1.grade, assessment2.grade);
  static byName = (assessment1: Assessment, assessment2: Assessment) => byString(assessment1.name, assessment2.name);

  static byGradeThenByName = join(AssessmentComparator.byGrade, AssessmentComparator.byName);
}
