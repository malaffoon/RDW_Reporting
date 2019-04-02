import { Assessment } from './assessment.model';
import { Exam } from './exam.model';

/**
 * This class represents a collection of Exams for a given Assessment.
 */
export interface AssessmentExam {
  assessment: Assessment;
  exams: Exam[];
}
