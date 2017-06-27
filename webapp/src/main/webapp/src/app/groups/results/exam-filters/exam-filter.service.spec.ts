import { ExamFilterService } from "./exam-filter.service";
import { FilterBy } from "../model/filter-by.model";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Assessment } from "../model/assessment.model";
import { Exam } from "../model/exam.model";
import { AssessmentType } from "../../../shared/enum/assessment-type.enum";

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
    filterBy.administration = 'SD';
    assessmentExam.assessment.type = AssessmentType.IAB;

    assessmentExam.exams[ 0 ].administrativeCondition = 'SD';
    assessmentExam.exams[ 1 ].administrativeCondition = 'NS';
    assessmentExam.exams[ 2 ].administrativeCondition = 'SD';
    assessmentExam.exams[ 3 ].administrativeCondition = 'NS';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.administrativeCondition == 'NS')).toBeFalsy();
  });

  it('should not filter exams by Administrative condition for Summative', () => {
    filterBy.administration = 'SD';
    assessmentExam.assessment.type = AssessmentType.SUMMATIVE;

    assessmentExam.exams[ 0 ].administrativeCondition = 'SD';
    assessmentExam.exams[ 1 ].administrativeCondition = 'NS';
    assessmentExam.exams[ 2 ].administrativeCondition = 'SD';
    assessmentExam.exams[ 3 ].administrativeCondition = 'NS';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.administrativeCondition == 'NS')).toBeTruthy();
  });

  it('should filter exams by summative status for Summative', () => {
    filterBy.summativeStatus = 'Valid';
    assessmentExam.assessment.type = AssessmentType.SUMMATIVE;

    assessmentExam.exams[ 0 ].administrativeCondition = 'Valid';
    assessmentExam.exams[ 1 ].administrativeCondition = 'IN';
    assessmentExam.exams[ 2 ].administrativeCondition = 'Valid';
    assessmentExam.exams[ 3 ].administrativeCondition = 'IN';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.administrativeCondition == 'IN')).toBeFalsy();
  });

  it('should not filter exams by summative status for IABs', () => {
    filterBy.summativeStatus = 'Valid';
    assessmentExam.assessment.type = AssessmentType.IAB;

    assessmentExam.exams[ 0 ].administrativeCondition = 'Valid';
    assessmentExam.exams[ 1 ].administrativeCondition = 'IN';
    assessmentExam.exams[ 2 ].administrativeCondition = 'Valid';
    assessmentExam.exams[ 3 ].administrativeCondition = 'IN';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.administrativeCondition == 'IN')).toBeTruthy();
  });

  it('should filter exams by completeness', () => {
    filterBy.completion = 'Partial';

    assessmentExam.exams[ 0 ].completeness = 'Partial';
    assessmentExam.exams[ 1 ].completeness = 'Complete';
    assessmentExam.exams[ 2 ].completeness = 'Partial';
    assessmentExam.exams[ 3 ].completeness = 'Complete';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.completeness == 'Complete')).toBeFalsy();
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
    filterBy.summativeStatus = 'SD';
    filterBy.completion = 'Partial';

    assessmentExam.assessment.grade = 3;

    // only completeness matches criteria.
    assessmentExam.exams[ 0 ].enrolledGrade = 2;
    assessmentExam.exams[ 0 ].administrativeCondition = 'Valid';
    assessmentExam.exams[ 0 ].completeness = 'Partial';

    // all fields match parameters, should return.
    assessmentExam.exams[ 1 ].enrolledGrade = 3;
    assessmentExam.exams[ 1 ].administrativeCondition = 'SD';
    assessmentExam.exams[ 1 ].completeness = 'Partial';

    // all fields but completeness match criteria, should not return.
    assessmentExam.exams[ 2 ].enrolledGrade = 3;
    assessmentExam.exams[ 2 ].administrativeCondition = 'SD';
    assessmentExam.exams[ 2 ].completeness = 'Complete';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);

    expect(actual.some(x => x.enrolledGrade == 2)).toBeFalsy();
    expect(actual.some(x => x.administrativeCondition == 'Valid')).toBeFalsy();
    expect(actual.some(x => x.completeness == 'Complete')).toBeFalsy();
  });

  it('should filter exams by gender', () => {
    filterBy.gender = 'Male';

    assessmentExam.exams[ 0 ].gender = 'Female';
    assessmentExam.exams[ 1 ].gender = 'Male';
    assessmentExam.exams[ 2 ].gender = 'Female';
    assessmentExam.exams[ 3 ].gender = 'Male';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.gender == 'Female')).toBeFalsy();
  });

  it('should filter exams by migrant status as Yes', () => {
    filterBy.migrantStatus = 1;

    assessmentExam.exams[ 0 ].migrantStatus = true;
    assessmentExam.exams[ 1 ].migrantStatus = false;
    assessmentExam.exams[ 2 ].migrantStatus = undefined;
    assessmentExam.exams[ 3 ].migrantStatus = undefined;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.migrantStatus === true)).toBeTruthy();
    expect(actual.some(x => x.migrantStatus === false)).toBeFalsy();
    expect(actual.some(x => x.migrantStatus == null)).toBeFalsy();
  });

  it('should filter exams by migrant status as No', () => {
    filterBy.migrantStatus = 2;

    assessmentExam.exams[ 0 ].migrantStatus = true;
    assessmentExam.exams[ 1 ].migrantStatus = false;
    assessmentExam.exams[ 2 ].migrantStatus = undefined;
    assessmentExam.exams[ 3 ].migrantStatus = undefined;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.migrantStatus === false)).toBeTruthy();
    expect(actual.some(x => x.migrantStatus === true)).toBeFalsy();
    expect(actual.some(x => x.migrantStatus == null)).toBeFalsy();
  });

  it('should filter exams by 504 plan', () => {
    filterBy.plan504 = 2;

    assessmentExam.exams[ 0 ].plan504 = true;
    assessmentExam.exams[ 1 ].plan504 = false;
    assessmentExam.exams[ 2 ].plan504 = false;
    assessmentExam.exams[ 3 ].plan504 = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(3);
    expect(actual.some(x => x.plan504 === false)).toBeTruthy();
    expect(actual.some(x => x.plan504 === true)).toBeFalsy();
  });

  it('should filter exams by IEP', () => {
    filterBy.iep = 1;

    assessmentExam.exams[ 0 ].iep = true;
    assessmentExam.exams[ 1 ].iep = false;
    assessmentExam.exams[ 2 ].iep = false;
    assessmentExam.exams[ 3 ].iep = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.iep === true)).toBeTruthy();
    expect(actual.some(x => x.iep === false)).toBeFalsy();
  });

  it('should filter exams by Economic Disadvantage', () => {
    filterBy.economicDisadvantage = 1;

    assessmentExam.exams[ 0 ].economicDisadvantage = true;
    assessmentExam.exams[ 1 ].economicDisadvantage = false;
    assessmentExam.exams[ 2 ].economicDisadvantage = false;
    assessmentExam.exams[ 3 ].economicDisadvantage = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.economicDisadvantage === true)).toBeTruthy();
    expect(actual.some(x => x.economicDisadvantage === false)).toBeFalsy();
  });

  it('should filter exams by Limited English Proficiency', () => {
    filterBy.limitedEnglishProficiency = 2;

    assessmentExam.exams[ 0 ].limitedEnglishProficiency = true;
    assessmentExam.exams[ 1 ].limitedEnglishProficiency = false;
    assessmentExam.exams[ 2 ].limitedEnglishProficiency = false;
    assessmentExam.exams[ 3 ].limitedEnglishProficiency = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(3);
    expect(actual.some(x => x.limitedEnglishProficiency === false)).toBeTruthy();
    expect(actual.some(x => x.limitedEnglishProficiency === true)).toBeFalsy();
  });

  it('should filter exams by ethnicities', () => {
    filterBy.ethnicities["Filipino"] = true;
    filterBy.ethnicities["Asian"] = true;
    filterBy.ethnicities["BlackOrAfricanAmerican"] = true;

    assessmentExam.exams[ 0 ].ethnicities = [ "Filipino", "White"];
    assessmentExam.exams[ 1 ].ethnicities = [ "White"] ;
    assessmentExam.exams[ 2 ].ethnicities = [ "Asian" ];
    assessmentExam.exams[ 3 ].ethnicities = [ "DemographicRaceTwoOrMoreRaces", "NativeHawaiianOrOtherPacificIslander" ];

    assessmentExam.exams = assessmentExam.exams.map((value, index) => {
      let exam = value;
      exam.session = index.toString();
      return exam;
    });

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual[0].session).toBe("0");
    expect(actual[1].session).toBe("2");
  });
});
