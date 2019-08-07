import { AssessmentItem } from './assessment-item.model';
import { ExamItemScore } from './exam-item-score.model';
import { StudentResponsesAssessmentItem } from './student-responses-item.model';

export function toStudentResponsesAssessmentItem(
  assessmentItem: AssessmentItem
): StudentResponsesAssessmentItem {
  const item: StudentResponsesAssessmentItem = {
    assessmentItem
  };

  if (assessmentItem.scores.length !== 1) {
    return item;
  }

  const score: ExamItemScore = assessmentItem.scores[0];
  if (score.points >= 0) {
    item.score = score.points;
    item.correctness = score.points / assessmentItem.maxPoints;
  }

  item.response = score.response;
  item.writingTraitScores = score.writingTraitScores;

  return item;
}
