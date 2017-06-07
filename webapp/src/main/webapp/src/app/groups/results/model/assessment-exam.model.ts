import { Assessment } from "./assessment.model";
import { Exam } from "./exam.model";

export class AssessmentExam {
  assessment: Assessment;
  exams: Exam[];

  constructor(){
    this.assessment = new Assessment();
    this.exams = [];
  }
}
