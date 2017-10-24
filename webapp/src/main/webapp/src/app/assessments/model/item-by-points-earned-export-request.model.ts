import { AssessmentItem } from "./assessment-item.model";
import { ItemPointField } from "./item-point-field.model";
import { Assessment } from "./assessment.model";

/**
 * This model represents an Item by Points Earned table export request.
 */
export class ItemByPointsEarnedExportRequest {
  assessment: Assessment;
  assessmentItems: AssessmentItem[];
  pointColumns: ItemPointField[];
  showAsPercent: boolean;
}
