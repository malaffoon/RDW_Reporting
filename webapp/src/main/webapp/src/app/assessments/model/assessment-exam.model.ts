import { Assessment } from './assessment';
import { Exam } from './exam';

/**
 * This class represents a collection of Exams for a given Assessment.
 */
export interface AssessmentExam {
  assessment: Assessment;
  exams: Exam[];
}
