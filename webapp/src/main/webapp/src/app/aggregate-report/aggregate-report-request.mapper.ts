import { Injectable } from "@angular/core";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { TranslateService } from "@ngx-translate/core";
import { AssessmentDefinition } from "./assessment/assessment-definition";

const equalSize = (a: any[], b: any[]) => a.length === b.length;
const idsOf = values => values.map(value => value.id);

/**
 * Responsible for creating aggregate report requests from supplied models
 */
@Injectable()
export class AggregateReportRequestMapper {

  constructor(private translate: TranslateService){
  }

  /**
   * Creates an aggregate report request form the given options and settings tailored to optimize backend performance
   *
   * @param {AggregateReportFormOptions} options the available report options
   * @param {AggregateReportFormSettings} settings the aggregate report form state
   * @returns {AggregateReportRequest}
   */
  map(options: AggregateReportFormOptions,
      settings: AggregateReportFormSettings,
      assessmentDefinition: AssessmentDefinition): AggregateReportRequest {

    const query: any = <AggregateReportQuery>{
      achievementLevelDisplayType: settings.performanceLevelDisplayType,
      assessmentTypeCode: settings.assessmentType,
      assessmentGradeCodes: settings.assessmentGrades,
      dimensionTypes: settings.dimensionTypes,
      includeAllDistricts: settings.includeAllDistricts,
      includeAllDistrictsOfSchools: settings.includeAllDistrictsOfSelectedSchools,
      includeAllSchoolsOfDistricts: settings.includeAllSchoolsOfSelectedDistricts,
      includeState: settings.includeStateResults,
      schoolYears: settings.schoolYears,
      subjectCodes: settings.subjects,
      valueDisplayType: settings.valueDisplayType
    };

    if (assessmentDefinition.interim) {
      if (!equalSize(settings.interimAdministrationConditions, options.interimAdministrationConditions)) {
        query.administrativeConditionCodes = settings.interimAdministrationConditions;
      }
    } else {
      if (!equalSize(settings.summativeAdministrationConditions, options.summativeAdministrationConditions)) {
        query.administrativeConditionCodes = settings.summativeAdministrationConditions;
      }
    }

    if (!equalSize(settings.completenesses, options.completenesses)) {
      query.completenessCodes = settings.completenesses;
    }
    if (!equalSize(settings.economicDisadvantages, options.economicDisadvantages)) {
      query.economicDisadvantageCodes = settings.economicDisadvantages;
    }
    if (!equalSize(settings.ethnicities, options.ethnicities)) {
      query.ethnicityCodes = settings.ethnicities;
    }
    if (settings.districts.length) {
      query.districtIds = idsOf(settings.districts)
    }
    if (!equalSize(settings.genders, options.genders)) {
      query.genderCodes = settings.genders;
    }
    if (!equalSize(settings.individualEducationPlans, options.individualEducationPlans)) {
      query.iepCodes = settings.individualEducationPlans;
    }
    if (!equalSize(settings.limitedEnglishProficiencies, options.limitedEnglishProficiencies)) {
      query.lepCodes = settings.limitedEnglishProficiencies;
    }
    if (!equalSize(settings.migrantStatuses, options.migrantStatuses)) {
      query.migrantStatusCodes = settings.migrantStatuses;
    }
    if (!equalSize(settings.section504s, options.section504s)) {
      query.section504Codes = settings.section504s;
    }
    if (settings.schools.length) {
      query.schoolIds = idsOf(settings.schools)
    }

    const name = settings.name
      ? settings.name
      : this.translate.instant('aggregate-reports.default-report-name');

    return {
      name: name,
      reportQuery: query
    }
  }

}
