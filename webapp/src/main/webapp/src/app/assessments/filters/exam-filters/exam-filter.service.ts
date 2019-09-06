import { Injectable } from '@angular/core';
import { ExamFilter } from '../../model/exam-filter.model';
import { FilterBy } from '../../model/filter-by.model';
import { Exam } from '../../model/exam';
import { Assessment } from '../../model/assessment';
import { Utils } from '../../../shared/support/support';

@Injectable()
export class ExamFilterService {
  private filterDefinitions = [
    new ExamFilter(
      'offGradeAssessment',
      'common.filters.test.off-grade-assessment',
      'exam-filter.off-grade',
      this.filterByEnrolledGradeOff
    ),
    new ExamFilter(
      'transferAssessment',
      'common.filters.test.transfer-assessment',
      'exam-filter.transfer',
      this.filterByTransferAssessment
    ),
    new ExamFilter(
      'administration',
      'common.filters.status.administration',
      'common.administration-condition',
      this.filterByAdministrativeCondition,
      x => x.type !== 'sum'
    ),
    new ExamFilter(
      'summativeStatus',
      'common.filters.status.summative',
      'common.administration-condition',
      this.filterByAdministrativeCondition,
      x => x.type === 'sum'
    ),
    new ExamFilter(
      'completion',
      'common.completeness-form-control.label',
      'common.completeness',
      this.filterByCompleteness
    ),
    new ExamFilter(
      'genders',
      'common.student-field.Gender',
      'common.gender',
      this.filterByGender
    ),
    new ExamFilter(
      'migrantStatus',
      'common.student-field.MigrantStatus',
      'common.polar',
      this.filterByMigrantStatus
    ),
    new ExamFilter(
      'plan504',
      'common.student-field.Section504',
      'common.polar',
      this.filterByplan504
    ),
    new ExamFilter(
      'iep',
      'common.student-field.IndividualEducationPlan',
      'common.polar',
      this.filterByIep
    ),
    new ExamFilter(
      'economicDisadvantage',
      'common.student-field.EconomicDisadvantage',
      'common.polar',
      this.filterByEconomicDisadvantage
    ),
    new ExamFilter(
      'limitedEnglishProficiency',
      'common.student-field.LimitedEnglishProficiency',
      'common.polar',
      this.filterByLimitedEnglishProficiency
    ),
    new ExamFilter(
      'elasCodes',
      'common.student-field.EnglishLanguageAcquisitionStatus',
      'common.elas',
      this.filterByElasCode
    ),
    new ExamFilter(
      'ethnicities',
      'common.student-field.Ethnicity',
      'common.ethnicity',
      this.filterByEthnicity
    ),
    new ExamFilter(
      'languageCodes',
      'common.student-field.PrimaryLanguage',
      'common.languages',
      this.filterByLanguageCode
    ),
    new ExamFilter(
      'militaryConnectedCodes',
      'common.student-field.MilitaryStudentIdentifier',
      'common.military-connected-code',
      this.filterByMilitaryConnectedCode
    )
  ];

  getFilterDefinitions(): ExamFilter[] {
    return this.filterDefinitions;
  }

  getFilterDefinitionFor(filterName: string): ExamFilter {
    return this.filterDefinitions.find(x => x.name == filterName);
  }

  /**
   * Filter exams
   *
   * @param exams  The exams
   * @param assessment The assessment
   * @param filterBy   The currently-applied filters
   * @returns {Exam[]} The filtered exams
   */
  filterExams(
    exams: Exam[],
    assessment: Assessment,
    filterBy: FilterBy
  ): Exam[] {
    if (filterBy == null) return exams;

    let filters = this.getFilters(filterBy);
    for (let filter of filters) {
      let filterDefinition = this.getFilterDefinitionFor(filter);

      if (filterDefinition.precondition(assessment)) {
        let filterValue = filterBy[filter];

        if (filter == 'offGradeAssessment') filterValue = assessment.grade;
        else if (filter == 'ethnicities')
          filterValue = filterBy.filteredEthnicities;
        else if (filter == 'genders') filterValue = filterBy.filteredGenders;
        else if (filter == 'elasCodes')
          filterValue = filterBy.filteredElasCodes;
        else if (filter == 'languageCodes')
          filterValue = filterBy.filteredLanguages;
        else if (filter == 'militaryConnectedCodes')
          filterValue = filterBy.filteredMilitaryConnectedCodes;

        exams = exams.filter(exam => filterDefinition.apply(exam, filterValue));
      }
    }

    return exams;
  }

  /**
   * Filter a collection of items that can be resolved to both an Assessment and Exam.
   *
   * @param assessmentProvider  Function to provide the Assessment for the given item
   * @param examProvider        Function to provide the Exam for the given item.
   * @param items               The source items
   * @param filterBy            The currently-applied filters
   * @returns {any[]} The filtered items
   */
  filterItems(
    assessmentProvider: (item: any) => Assessment,
    examProvider: (item: any) => Exam,
    items: any[],
    filterBy: FilterBy
  ): any[] {
    if (filterBy == null) {
      return items;
    }

    let results: any[] = items;
    let filters = this.getFilters(filterBy);
    for (let filter of filters) {
      let filterDefinition = this.getFilterDefinitionFor(filter);

      results = results.filter(item => {
        let assessment: Assessment = assessmentProvider(item);
        if (!filterDefinition.precondition(assessment)) return true;

        let exam: Exam = examProvider(item);
        let filterValue = filterBy[filter];

        if (filter == 'offGradeAssessment') {
          filterValue = assessment.grade;
        } else if (filter == 'ethnicities') {
          filterValue = filterBy.filteredEthnicities;
        } else if (filter == 'genders') {
          filterValue = filterBy.filteredGenders;
        } else if (filter == 'elasCodes') {
          filterValue = filterBy.filteredElasCodes;
        } else if (filter == 'langageCodes') {
          filterValue = filterBy.filteredLanguages;
        } else if (filter == 'militaryConnectedCodes') {
          filterValue = filterBy.filteredMilitaryConnectedCodes;
        }
        return filterDefinition.apply(exam, filterValue);
      });
    }

    return results;
  }

  // remove individual '*.code' (i.e. 'gender.code') and add just one gender/ethnicity/elas/language/...
  // as they need to be evaluated all at once.
  private getFilters(filterBy: FilterBy): string[] {
    let filters = filterBy.all;
    if (filters.some(x => x.indexOf('ethnicities') > -1)) {
      filters = filters.filter(x => x.indexOf('ethnicities') == -1);
      filters.push('ethnicities');
    }
    if (filters.some(x => x.indexOf('genders') > -1)) {
      filters = filters.filter(x => x.indexOf('genders') == -1);
      filters.push('genders');
    }
    if (filters.some(x => x.indexOf('elasCodes') > -1)) {
      filters = filters.filter(x => x.indexOf('elasCodes') == -1);
      filters.push('elasCodes');
    }
    if (filters.some(x => x.indexOf('languageCodes') > -1)) {
      filters = filters.filter(x => x.indexOf('languageCodes') == -1);
      filters.push('languageCodes');
    }
    if (filters.some(x => x.indexOf('militaryConnectedCodes') > -1)) {
      filters = filters.filter(x => x.indexOf('militaryConnectedCodes') == -1);
      filters.push('militaryConnectedCodes');
    }

    return filters;
  }

  private filterByAdministrativeCondition(
    exam: Exam,
    filterValue: any
  ): boolean {
    return exam.administrativeCondition === filterValue;
  }

  private filterByCompleteness(exam: Exam, filterValue: any): boolean {
    return exam.completeness === filterValue;
  }

  private filterByEnrolledGradeOff(exam: Exam, filterValue: any): boolean {
    return exam.enrolledGrade === filterValue;
  }

  private filterByGender(exam: Exam, filterValue: any): boolean {
    return (
      (exam.student && !filterValue.length) ||
      filterValue.some(gender => gender == exam.student.genderCode)
    );
  }

  private filterByElasCode(exam: Exam, filterValue: any): boolean {
    return (
      (exam.student && !filterValue.length) ||
      filterValue.some(elasCode => elasCode == exam.elasCode)
    );
  }

  private filterByMigrantStatus(exam: Exam, filterValue: any): boolean {
    return exam.migrantStatus == Utils.polarEnumToBoolean(filterValue);
  }

  private filterByplan504(exam: Exam, filterValue: any): boolean {
    return exam.plan504 === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByIep(exam: Exam, filterValue: any): boolean {
    return exam.iep === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByEconomicDisadvantage(exam: Exam, filterValue: any): boolean {
    return exam.economicDisadvantage === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByLimitedEnglishProficiency(
    exam: Exam,
    filterValue: any
  ): boolean {
    return (
      exam.limitedEnglishProficiency === Utils.polarEnumToBoolean(filterValue)
    );
  }

  private filterByEthnicity(exam: Exam, filterValue: any): boolean {
    return (
      exam.student &&
      exam.student.ethnicityCodes.some(ethnicity =>
        filterValue.some(code => code == ethnicity)
      )
    );
  }

  private filterByLanguageCode(exam: Exam, filterValue: any): boolean {
    return filterValue.some(languageCode => languageCode === exam.languageCode);
  }

  private filterByTransferAssessment(exam: Exam, filterValue: any): boolean {
    return !filterValue || !exam.transfer;
  }

  private filterByMilitaryConnectedCode(exam: Exam, filterValue: any): boolean {
    return (
      (exam.student && !filterValue.length) ||
      filterValue.some(
        militaryConnectedCode =>
          militaryConnectedCode == exam.militaryConnectedCode
      )
    );
  }
}
