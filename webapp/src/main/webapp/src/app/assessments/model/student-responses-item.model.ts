import { AssessmentItem } from './assessment-item.model';
import { WritingTraitScores } from './writing-trait-scores.model';

/**
 * This model wrapper class contains both an AssessmentItem and
 * calculated correctness value.
 *
 * TODO and make this a view model for item tab because that is what it is scoped to
 */
export interface StudentResponsesAssessmentItem {
  assessmentItem: AssessmentItem;
  score?: number;
  correctness?: number;
  response?: string;
  writingTraitScores?: WritingTraitScores;
}
