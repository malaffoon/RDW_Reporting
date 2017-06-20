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

  calculateBuckets() {
    this.buckets = this.getBuckets();
  }

  getBuckets() {
    let result = [];
    for(let i=0; i <= this.maxPoints; i++){
      result[i] = this.scores.filter(x => x.points == i).length;
    }

    return result;
  }
}
