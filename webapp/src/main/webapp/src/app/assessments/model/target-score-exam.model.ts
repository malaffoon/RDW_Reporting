import { Exam } from './exam';

export interface TargetScoreExam extends Exam {
  targetId: number;
  standardMetRelativeResidualScore: number;
  studentRelativeResidualScore: number;
}
