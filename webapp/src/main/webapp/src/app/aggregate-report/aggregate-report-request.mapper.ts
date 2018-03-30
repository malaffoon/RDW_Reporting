import { Injectable } from "@angular/core";
import {
  BasicAggregateReportQuery,
  BasicAggregateReportRequest,
  StudentFilters
} from "../report/basic-aggregate-report-request";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { TranslateService } from "@ngx-translate/core";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportOptions } from "./aggregate-report-options";
import { Observable } from "rxjs/Observable";
import { District, OrganizationType, School } from "../shared/organization/organization";
import { Utils } from "../shared/support/support";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { ranking } from "@kourge/ordering/comparator";
import { ordering } from "@kourge/ordering";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { SubgroupFilters, SubgroupFilterSupport } from './subgroup-filters';

const equalSize = (a: any[], b: any[]) => Utils.hasEqualLength(a, b);
const idsOf = values => values.map(value => value.id);
const hasOption = (options: any[], value) => options.find(option => option === value) != null;
const notNullOrEmpty = (value) => !Utils.isNullOrEmpty(value);

/**
 * Responsible for creating aggregate report requests from supplied models
 */
@Injectable()
export class AggregateReportRequestMapper {

  constructor(private translate: TranslateService,
              private organizationService: AggregateReportOrganizationService){
  }

  /**
   * Creates an aggregate report request form the given options and settings tailored to optimize backend performance
   *
   * @param {AggregateReportFormOptions} options the available report options
   * @param {AggregateReportFormSettings} settings the aggregate report form state
   * @param {AssessmentDefinition} assessmentDefinition
   * @returns {BasicAggregateReportRequest}
   */
  map(options: AggregateReportFormOptions,
      settings: AggregateReportFormSettings,
      assessmentDefinition: AssessmentDefinition): BasicAggregateReportRequest {

    const performanceLevelDisplayType = assessmentDefinition.performanceLevelDisplayTypes.includes(settings.performanceLevelDisplayType)
      ? settings.performanceLevelDisplayType
      : assessmentDefinition.performanceLevelDisplayTypes[0];

    const query: any = <BasicAggregateReportQuery>{
      achievementLevelDisplayType: performanceLevelDisplayType,
      assessmentTypeCode: settings.assessmentType,
      assessmentGradeCodes: settings.assessmentGrades,
      dimensionTypes: settings.dimensionTypes,
      includeAllDistricts: settings.includeAllDistricts,
      includeAllDistrictsOfSchools: settings.includeAllDistrictsOfSelectedSchools,
      includeAllSchoolsOfDistricts: settings.includeAllSchoolsOfSelectedDistricts,
      includeState: settings.includeStateResults && settings.assessmentType === 'sum',
      queryType: settings.queryType,
      schoolYears: settings.schoolYears,
      subjectCodes: settings.subjects,
      valueDisplayType: settings.valueDisplayType,
      columnOrder: settings.columnOrder
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

    if (settings.districts.length) {
      query.districtIds = idsOf(settings.districts);
    }

    if (settings.schools.length) {
      query.schoolIds = idsOf(settings.schools);
    }

    // Set type-specific parameters
    if (settings.queryType === 'Basic') {
      query.studentFilters = this.createStudentFilters(settings.studentFilters, options.studentFilters);
    } else if (settings.queryType === 'FilteredSubgroup') {
      query.subgroups = this.createSubgroups(settings.subgroups);
    }

    const name = settings.name
      ? settings.name
      : this.translate.instant('aggregate-report-form.default-report-name');

    return {
      name: name,
      query: query
    };
  }

  toSettings(request: BasicAggregateReportRequest, options: AggregateReportOptions): Observable<AggregateReportFormSettings> {

    const query: BasicAggregateReportQuery = request.query;
    const filters: StudentFilters = query.studentFilters || {};

    const queryInterimAdministrationConditions = (query.administrativeConditionCodes || [])
      .filter(code => hasOption(options.interimAdministrationConditions, code));

    const querySummativeAdministrationConditions = (query.administrativeConditionCodes || [])
      .filter(code => hasOption(options.summativeAdministrationConditions, code));

    const schoolIds: number[] = request.query.schoolIds;
    const schools: Observable<School[]> = !Utils.isNullOrEmpty(schoolIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.School, schoolIds)
      : of([]);

    const districtIds: number[] = request.query.districtIds;
    const districts: Observable<District[]> = !Utils.isNullOrEmpty(districtIds)
      ? this.organizationService.getOrganizationsByIdAndType(OrganizationType.District, districtIds)
      : of([]);

    // Returns the first argument that is not null or empty
    const or = (a: any, b: any) => Utils.isNullOrEmpty(a) ? b : a;

    // Safely sorts the provided values ranked by the provided options
    const sort = (values: any[], options: any[]) => (values || []).sort(ordering(ranking(options)).compare);

    const studentFilters = query.queryType === 'Basic'
      ? {
        economicDisadvantages: or(
          sort(filters.economicDisadvantageCodes, options.studentFilters.economicDisadvantages),
          options.studentFilters.economicDisadvantages
        ),
        ethnicities: or(
          sort(filters.ethnicityCodes, options.studentFilters.ethnicities),
          options.studentFilters.ethnicities
        ),
        genders: or(
          sort(filters.genderCodes, options.studentFilters.genders),
          options.studentFilters.genders
        ),
        individualEducationPlans: or(
          sort(filters.iepCodes, options.studentFilters.individualEducationPlans),
          options.studentFilters.individualEducationPlans
        ),
        limitedEnglishProficiencies: or(
          sort(filters.lepCodes, options.studentFilters.individualEducationPlans),
          options.studentFilters.individualEducationPlans
        ),
        migrantStatuses: or(
          sort(filters.migrantStatusCodes, options.studentFilters.migrantStatuses),
          options.studentFilters.migrantStatuses
        ),
        section504s: or(
          sort(filters.section504Codes, options.studentFilters.section504s),
          options.studentFilters.section504s
        ),
      }
      : {};

    const subgroups = query.queryType === 'FilteredSubgroup'
      ? this.createSubgroupFilters(query.subgroups)
      : [];

    console.log('qs', query.subgroups)
    console.log('qs.values()', Object.values(query.subgroups))
    console.log('qs.values().map()', Object.values(query.subgroups)
      .map(remoteSubgroup => SubgroupFilterSupport.prune(remoteSubgroup as SubgroupFilters)));

    console.log('sg', subgroups);

    return forkJoin(schools, districts)
      .pipe(
        map(([ schools, districts ]) => {
          return <AggregateReportFormSettings>{
            assessmentType: query.assessmentTypeCode,
            assessmentGrades: sort(query.assessmentGradeCodes, options.assessmentGrades),
            columnOrder: query.columnOrder,
            completenesses: or(
              sort(query.completenessCodes, options.completenesses),
              options.completenesses
            ),
            dimensionTypes: or(
              sort(query.dimensionTypes, options.dimensionTypes),
              []
            ),
            districts: districts,
            includeAllDistricts: query.includeAllDistricts,
            includeAllDistrictsOfSelectedSchools: query.includeAllDistrictsOfSchools,
            includeAllSchoolsOfSelectedDistricts: query.includeAllSchoolsOfDistricts,
            includeStateResults: query.includeState,
            interimAdministrationConditions: !queryInterimAdministrationConditions.length
              ? options.interimAdministrationConditions
              : queryInterimAdministrationConditions,
            name: request.name,
            performanceLevelDisplayType: query.achievementLevelDisplayType,
            queryType: query.queryType,
            schoolYears: query.schoolYears.sort((a, b) => b - a),
            schools: schools,
            studentFilters: studentFilters,
            subjects: sort(query.subjectCodes, options.subjects),
            subgroups: subgroups,
            summativeAdministrationConditions: !querySummativeAdministrationConditions.length
              ? options.summativeAdministrationConditions
              : querySummativeAdministrationConditions,
            valueDisplayType: query.valueDisplayType
          };
        })
      );
  }

  private createStudentFilters(settingFilters, optionFilters): StudentFilters {
    const queryFilters: any = {};
    if (!equalSize(settingFilters.economicDisadvantages, optionFilters.economicDisadvantages)) {
      queryFilters.economicDisadvantageCodes = settingFilters.economicDisadvantages;
    }
    if (!equalSize(settingFilters.ethnicities, optionFilters.ethnicities)) {
      queryFilters.ethnicityCodes = settingFilters.ethnicities;
    }
    if (!equalSize(settingFilters.genders, optionFilters.genders)) {
      queryFilters.genderCodes = settingFilters.genders;
    }
    if (!equalSize(settingFilters.individualEducationPlans, optionFilters.individualEducationPlans)) {
      queryFilters.iepCodes = settingFilters.individualEducationPlans;
    }
    if (!equalSize(settingFilters.limitedEnglishProficiencies, optionFilters.limitedEnglishProficiencies)) {
      queryFilters.lepCodes = settingFilters.limitedEnglishProficiencies;
    }
    if (!equalSize(settingFilters.migrantStatuses, optionFilters.migrantStatuses)) {
      queryFilters.migrantStatusCodes = settingFilters.migrantStatuses;
    }
    if (!equalSize(settingFilters.section504s, optionFilters.section504s)) {
      queryFilters.section504Codes = settingFilters.section504s;
    }
    return queryFilters;
  }

  private createStudentFiltersFromSubgroup(settingFilters: SubgroupFilters): StudentFilters {

    const queryFilters: any = {};
    if (notNullOrEmpty(settingFilters.economicDisadvantages)) {
      queryFilters.economicDisadvantageCodes = settingFilters.economicDisadvantages;
    }
    if (notNullOrEmpty(settingFilters.ethnicities)) {
      queryFilters.ethnicityCodes = settingFilters.ethnicities;
    }
    if (notNullOrEmpty(settingFilters.genders)) {
      queryFilters.genderCodes = settingFilters.genders;
    }
    if (notNullOrEmpty(settingFilters.individualEducationPlans)) {
      queryFilters.iepCodes = settingFilters.individualEducationPlans;
    }
    if (notNullOrEmpty(settingFilters.limitedEnglishProficiencies)) {
      queryFilters.lepCodes = settingFilters.limitedEnglishProficiencies;
    }
    if (notNullOrEmpty(settingFilters.migrantStatuses)) {
      queryFilters.migrantStatusCodes = settingFilters.migrantStatuses;
    }
    if (notNullOrEmpty(settingFilters.section504s)) {
      queryFilters.section504Codes = settingFilters.section504s;
    }
    return queryFilters;
  }

  private createSubgroups(settingFilters: SubgroupFilters[]): {[key: string]: StudentFilters} {
    return settingFilters.reduce((subgroups, filters, index) => {
      subgroups[(index + 1).toString()] = this.createStudentFiltersFromSubgroup(filters);
      return subgroups;
    }, {});
  }

  private createSubgroupFilters(querySubgroups: {[key: string]: StudentFilters}): StudentFilters[] {
    return Object.values(querySubgroups) // This ignores the keys as we do not use them at the moment
      .map(queryFilters => {
        const subgroupFilters: any = {};
        if (notNullOrEmpty(queryFilters.economicDisadvantageCodes)) {
          subgroupFilters.economicDisadvantages = queryFilters.economicDisadvantageCodes;
        }
        if (notNullOrEmpty(queryFilters.ethnicityCodes)) {
          subgroupFilters.ethnicities = queryFilters.ethnicityCodes;
        }
        if (notNullOrEmpty(queryFilters.genderCodes)) {
          subgroupFilters.genders = queryFilters.genderCodes;
        }
        if (notNullOrEmpty(queryFilters.iepCodes)) {
          subgroupFilters.individualEducationPlans = queryFilters.iepCodes;
        }
        if (notNullOrEmpty(queryFilters.lepCodes)) {
          subgroupFilters.limitedEnglishProficiencies = queryFilters.lepCodes;
        }
        if (notNullOrEmpty(queryFilters.migrantStatusCodes)) {
          subgroupFilters.migrantStatuses = queryFilters.migrantStatusCodes;
        }
        if (notNullOrEmpty(queryFilters.section504Codes)) {
          subgroupFilters.section504Codes = queryFilters.section504Codes;
        }
        return subgroupFilters;
      });
  }

}
