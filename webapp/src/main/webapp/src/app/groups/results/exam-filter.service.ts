import { Injectable } from "@angular/core";
import { ExamFilter } from "./model/exam-filter.model";
import { Exam } from "./model/exam.model";
import { FilterBy } from "./model/filter-by.model";
import { AssessmentExam } from "./model/assessment-exam.model";

@Injectable()
export class ExamFilterService {
  private root = 'labels.groups.results.adv-filters.';

  private filterDefinitions = [
    new ExamFilter('offGradeAssessment', this.root + 'test.off-grade-assessment', 'enum.off-grade', this.notImplemented),
    new ExamFilter('administration', this.root + 'status.administration','enum.administrative-condition', this.filterByAdministrativeCondition, x => x.isIab),
    new ExamFilter('summativeStatus', this.root + 'status.summative', 'enum.administrative-condition', this.filterByAdministrativeCondition, x => !x.isIab),
    new ExamFilter('completion', this.root + 'status.completion', 'enum.completeness', this.notImplemented),
    new ExamFilter('gender', this.root + 'student.gender', 'enum.gender', this.notImplemented),
    new ExamFilter('migrantStatus', this.root + 'student.migrant-status', 'enum.polar', this.notImplemented),
    new ExamFilter('plan504', this.root + 'student.504-plan', 'enum.polar', this.notImplemented),
    new ExamFilter('iep', this.root + 'student.iep', 'enum.polar', this.notImplemented),
    new ExamFilter('economicDisadvantage', this.root + 'student.economic-disadvantage', 'enum.polar', this.notImplemented),
    new ExamFilter('limitedEnglishProficiency', this.root + 'student.limited-english-proficiency', 'enum.polar', this.notImplemented),
    new ExamFilter('filteredEthnicities', this.root + 'student.ethnicity', 'enum.ethnicity', this.notImplemented)
  ];

  getFilterDefinitions() {
    return this.filterDefinitions;
  }

  getFilterDefinitionFor(filterName) {
    return this.filterDefinitions.find(x => x.name == filterName);
  }

  applyFilterFor(filterName, exam : Exam, filterBy: FilterBy) : boolean {
    return this.getFilterDefinitionFor(this.getFilterDefinitionFor(filterName)).apply(exam, filterBy);
  }

  filterExams(assessmentExam : AssessmentExam, filterBy : FilterBy) {
    let exams = assessmentExam.exams;

    if(!filterBy)
      return exams;

    for(let filter of filterBy.all){
      let filterDefinition = this.getFilterDefinitionFor(filter);

      if(filterDefinition.precondition(assessmentExam.assessment))
        exams = assessmentExam.exams.filter(exam => filterDefinition.apply(exam, filterBy[filter]));
    }

    return exams;
  }

  notImplemented(exam: Exam, filterValue: any) : boolean {
    return true;
  }

  filterByAdministrativeCondition(exam: Exam, filterValue: any) {
    return exam.administrativeCondition == filterValue;
  }
}
