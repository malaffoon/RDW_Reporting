import { ExamItemScore } from './exam-item-score.model';

export function toDifficultyLevel(difficultyCode: string): number {
  switch (difficultyCode) {
    case 'E':
      return 1;
    case 'M':
      return 2;
    case 'D':
      return 3;
  }
  return 0;
}

export function fullCreditItemCount(
  scores: ExamItemScore[],
  maximumPoints: number
): number {
  return scores.filter(x => x.points == maximumPoints).length;
}

export function fullCreditItemPercent(
  scores: ExamItemScore[],
  maximumPoints: number
): number {
  const scoreCount = scores.reduce(
    (count, score) => (score.points >= 0 ? count + 1 : count),
    0
  );
  return scoreCount > 0
    ? (fullCreditItemCount(scores, maximumPoints) / scoreCount) * 100
    : 0;
}

// TODO rename to AssessmentExamItem since it has both assessment level metadata and exam level data
export class AssessmentItem {
  id: number;
  bankItemKey: string;
  position: number;
  claim: string;
  targetId: number;
  targetNaturalId: string;
  depthOfKnowledge: DepthOfKnowledge;
  mathPractice: string;
  allowCalculator: string;
  difficulty: string;
  commonCoreStandardIds: string[];
  maxPoints: number;
  numberOfChoices: number;
  scores: ExamItemScore[] = [];
  type: string;
  answerKey: string;
  performanceTaskWritingType: string;

  /**
   * @deprecated use {@link toDifficultyLevel}
   */
  get difficultySortOrder() {
    return toDifficultyLevel(this.difficulty);
  }

  /**
   * @deprecated use {@link TranslateService}
   */
  get claimTarget() {
    return this.claim + ' / ' + this.targetNaturalId;
  }

  /**
   * @deprecated use {@link fullCreditItemCount}
   */
  get fullCredit(): number {
    return fullCreditItemCount(this.scores, this.maxPoints);
  }

  /**
   * @deprecated use {@link fullCreditItemPercent}
   */
  get fullCreditAsPercent(): number {
    return fullCreditItemPercent(this.scores, this.maxPoints);
  }
}

export interface DepthOfKnowledge {
  readonly level: number;
  readonly referenceUrl: string;
}
