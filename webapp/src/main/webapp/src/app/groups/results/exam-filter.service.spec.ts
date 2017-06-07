import { ExamFilterService } from "./exam-filter.service";
import { FilterBy } from "./model/filter-by.model";
import { AssessmentExam } from "./model/assessment-exam.model";
import { Assessment } from "./model/assessment.model";
import { Exam } from "./model/exam.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";

describe('ExamFilterService', () => {
  let assessmentExam: AssessmentExam;
  let filterBy: FilterBy;
  let fixture: ExamFilterService;

  beforeEach(() => {
    filterBy = new FilterBy();

    assessmentExam = new AssessmentExam();
    assessmentExam.assessment = new Assessment();
    assessmentExam.exams = [
      new Exam(),
      new Exam(),
      new Exam(),
      new Exam()
    ];

    fixture = new ExamFilterService();
  });

  it('should filter exams by Administrative condition for IABs', () => {
    filterBy.administration = 2;
    assessmentExam.assessment.type = AssessmentType.IAB;

    assessmentExam.exams[ 0 ].administrativeCondition = 2;
    assessmentExam.exams[ 1 ].administrativeCondition = 3;
    assessmentExam.exams[ 2 ].administrativeCondition = 2;
    assessmentExam.exams[ 3 ].administrativeCondition = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.administrativeCondition == 3)).toBeFalsy();
  });

  it('should not filter exams by Administrative condition for Summative', () => {
    filterBy.administration = 2;
    assessmentExam.assessment.type = AssessmentType.SUMMATIVE;

    assessmentExam.exams[ 0 ].administrativeCondition = 2;
    assessmentExam.exams[ 1 ].administrativeCondition = 3;
    assessmentExam.exams[ 2 ].administrativeCondition = 2;
    assessmentExam.exams[ 3 ].administrativeCondition = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.administrativeCondition == 3)).toBeTruthy();
  });

  it('should filter exams by summative status for Summative', () => {
    filterBy.summativeStatus = 2;
    assessmentExam.assessment.type = AssessmentType.SUMMATIVE;

    assessmentExam.exams[ 0 ].administrativeCondition = 2;
    assessmentExam.exams[ 1 ].administrativeCondition = 3;
    assessmentExam.exams[ 2 ].administrativeCondition = 2;
    assessmentExam.exams[ 3 ].administrativeCondition = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.administrativeCondition == 3)).toBeFalsy();
  });

  it('should not filter exams by summative status for IABs', () => {
    filterBy.summativeStatus = 2;
    assessmentExam.assessment.type = AssessmentType.IAB;

    assessmentExam.exams[ 0 ].administrativeCondition = 2;
    assessmentExam.exams[ 1 ].administrativeCondition = 3;
    assessmentExam.exams[ 2 ].administrativeCondition = 2;
    assessmentExam.exams[ 3 ].administrativeCondition = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.administrativeCondition == 3)).toBeTruthy();
  });

  it('should filter exams by completeness', () => {
    filterBy.completion = 2;

    assessmentExam.exams[ 0 ].completeness = 2;
    assessmentExam.exams[ 1 ].completeness = 3;
    assessmentExam.exams[ 2 ].completeness = 2;
    assessmentExam.exams[ 3 ].completeness = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.completeness == 3)).toBeFalsy();
  });

  it('should hide off-grade when offGradeAssessment is true', () => {
    filterBy.offGradeAssessment = true;

    assessmentExam.assessment.grade = 2;

    assessmentExam.exams[ 0 ].enrolledGrade = 2;
    assessmentExam.exams[ 1 ].enrolledGrade = 3;
    assessmentExam.exams[ 2 ].enrolledGrade = 2;
    assessmentExam.exams[ 3 ].enrolledGrade = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.enrolledGrade == 3)).toBeFalsy();
  });

  it('should show off-grade when offGradeAssessment is false', () => {
    filterBy.offGradeAssessment = false;

    assessmentExam.assessment.grade = 2;

    assessmentExam.exams[ 0 ].enrolledGrade = 2;
    assessmentExam.exams[ 1 ].enrolledGrade = 3;
    assessmentExam.exams[ 2 ].enrolledGrade = 2;
    assessmentExam.exams[ 3 ].enrolledGrade = 3;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.enrolledGrade == 3)).toBeTruthy();
  });

  it('should filter by completeness, off-grade, and summative status', () => {
    filterBy.offGradeAssessment = true;
    filterBy.summativeStatus = 2;
    filterBy.completion = 1;

    assessmentExam.assessment.grade = 3;

    // only completeness matches criteria.
    assessmentExam.exams[ 0 ].enrolledGrade = 2;
    assessmentExam.exams[ 0 ].administrativeCondition = 1;
    assessmentExam.exams[ 0 ].completeness = 1;

    // all fields match parameters, should return.
    assessmentExam.exams[ 1 ].enrolledGrade = 3;
    assessmentExam.exams[ 1 ].administrativeCondition = 2;
    assessmentExam.exams[ 1 ].completeness = 1;

    // all fields but completeness match criteria, should not return.
    assessmentExam.exams[ 2 ].enrolledGrade = 3;
    assessmentExam.exams[ 2 ].administrativeCondition = 2;
    assessmentExam.exams[ 2 ].completeness = 2;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);

    expect(actual.some(x => x.enrolledGrade == 2)).toBeFalsy();
    expect(actual.some(x => x.administrativeCondition == 1)).toBeFalsy();
    expect(actual.some(x => x.completeness == 2)).toBeFalsy();
  });

});
