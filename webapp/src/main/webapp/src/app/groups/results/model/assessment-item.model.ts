import { ExamItemScore } from "./exam-item-score.model";

export class AssessmentItem {
  id: number;
  claim: string;
  target: string;
  difficultyCode: string;
  maxPoints: number;
  scores: ExamItemScore[] = [];

  get buckets() {
    let result = [];
    for(let i=0; i <= this.maxPoints; i++){
      result[i] = this.scores.filter(x => x.points == i).length;
    }

    return result;
  }
}
