import { ExamItemScore } from "./exam-item-score.model";

export class AssessmentItem {
  id: number;
  claim: string;
  target: string;
  difficulty: string;
  maxPoints: number;
  scores: ExamItemScore[] = [];
  buckets = [];

  get fullCredit() {
    return this.scores.filter(x => x.points == this.maxPoints).length;
  }
}
