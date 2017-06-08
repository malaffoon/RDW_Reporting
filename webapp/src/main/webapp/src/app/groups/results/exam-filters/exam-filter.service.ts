import { Injectable } from "@angular/core";
import { ExamFilter } from "../model/exam-filter.model";
import { Exam } from "../model/exam.model";
import { FilterBy } from "../model/filter-by.model";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Utils } from "../../../shared/Utils";

@Injectable()
export class ExamFilterService {
  private root = 'labels.groups.results.adv-filters.';

  private filterDefinitions = [
    new ExamFilter('offGradeAssessment', this.root + 'test.off-grade-assessment', 'enum.off-grade', this.filterByEnrolledGradeOff),
    new ExamFilter('administration', this.root + 'status.administration', 'enum.administrative-condition', this.filterByAdministrativeCondition, x => !x.isSummative),
    new ExamFilter('summativeStatus', this.root + 'status.summative', 'enum.administrative-condition', this.filterByAdministrativeCondition, x => x.isSummative),
    new ExamFilter('completion', this.root + 'status.completion', 'enum.completeness', this.filterByCompleteness),
    new ExamFilter('gender', this.root + 'student.gender', 'enum.gender', this.filterByGender),
    new ExamFilter('migrantStatus', this.root + 'student.migrant-status', 'enum.polar', this.filterByMigrantStatus),
    new ExamFilter('plan504', this.root + 'student.504-plan', 'enum.polar', this.filterByplan504),
    new ExamFilter('iep', this.root + 'student.iep', 'enum.polar', this.filterByIep),
    new ExamFilter('economicDisadvantage', this.root + 'student.economic-disadvantage', 'enum.polar', this.filterByEconomicDisadvantage),
    new ExamFilter('limitedEnglishProficiency', this.root + 'student.limited-english-proficiency', 'enum.polar', this.filterByLimitedEnglishProficiency),
    new ExamFilter('ethnicities', this.root + 'student.ethnicity', 'enum.ethnicity', this.notImplemented)
  ];

  getFilterDefinitions() {
    return this.filterDefinitions;
  }

  getFilterDefinitionFor(filterName) {
    return this.filterDefinitions.find(x => x.name == filterName);
  }

  private applyFilterFor(filterName, exam: Exam, filterBy: FilterBy): boolean {
    return this.getFilterDefinitionFor(this.getFilterDefinitionFor(filterName)).apply(exam, filterBy);
  }

  filterExams(assessmentExam: AssessmentExam, filterBy: FilterBy) {
    let exams = assessmentExam.exams;

    if (filterBy == null)
      return exams;

    for (let filter of filterBy.all) {
      let name = filter.indexOf('ethnicities') > -1 ? 'ethnicities' : filter;
      let filterDefinition = this.getFilterDefinitionFor(name);

      if (filterDefinition.precondition(assessmentExam.assessment)) {
        let filterValue = filter == 'offGradeAssessment' ? assessmentExam.assessment.grade : filterBy[name];
        exams = exams.filter(exam => filterDefinition.apply(exam, filterValue));
      }
    }

    return exams;
  }

  private notImplemented(exam, filterValue: any): boolean {
    return true;
  }

  private filterByAdministrativeCondition(exam: Exam, filterValue: any) {
    return exam.administrativeCondition === filterValue;
  }

  private filterByCompleteness(exam: Exam, filterValue: any) {
    return exam.completeness === filterValue;
  }

  private filterByEnrolledGradeOff(exam: Exam, filterValue: any) {
    return exam.enrolledGrade === filterValue;
  }

  private filterByGender(exam: Exam, filterValue: any) {
    return exam.gender === filterValue;
  }

  private filterByMigrantStatus(exam: Exam, filterValue: any) {
    return exam.migrantStatus == Utils.polarEnumToBoolean(filterValue);
  }

  private filterByplan504(exam: Exam, filterValue: any) {
    return exam.plan504 === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByIep(exam: Exam, filterValue: any) {
    return exam.iep === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByEconomicDisadvantage(exam: Exam, filterValue: any) {
    return exam.economicDisadvantage === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByLimitedEnglishProficiency(exam: Exam, filterValue: any) {
    return exam.limitedEnglishProficiency === Utils.polarEnumToBoolean(filterValue);
  }
}
