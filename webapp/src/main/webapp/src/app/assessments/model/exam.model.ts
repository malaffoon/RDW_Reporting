import { Student } from '../../student/model/student.model';
import { School } from '../../shared/organization/organization';
import { ScaleScore } from '../../exam/model/scale-score';

// TODO should contain scaleScore instead of implementing it
export class Exam implements ScaleScore {
  id: number;
  student: Student;
  date: Date;
  session: string;
  enrolledGrade: string;
  score: number;
  level: number;
  administrativeCondition: string;
  completeness: string;
  standardError: number;
  migrantStatus: boolean;
  plan504: boolean;
  iep: boolean;
  limitedEnglishProficiency: boolean;
  schoolYear: number;
  alternateScaleScores: ScaleScore[];
  claimScores: ScaleScore[];
  accommodationCodes: string[];
  school: School;
  transfer: boolean;
  elasCode: string;
  languageCode: string;
  militaryConnectedCode: string;
}
