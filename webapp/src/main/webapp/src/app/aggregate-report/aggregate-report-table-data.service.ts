import { AssessmentDefinitionService } from "./assessment/assessment-definition.service";
import { Injectable } from "@angular/core";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportTable } from "./results/aggregate-report-table.component";
import { DefaultSchool, Organization, School } from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { AssessmentDefinition } from "./assessment/assessment-definition";

const codeOf = entity => entity.code;
const codesOf = entities => entities.map(codeOf);

const DimensionConfigurationByType: { [dimensionType: string]: DimensionConfiguration } = {
  Gender: {
    getDimensionValueCodes: settings => codesOf(settings.genders),
    getTranslationCode: value => `common.gender.${value}`
  },
  Ethnicity: {
    getDimensionValueCodes: settings => codesOf(settings.ethnicities),
    getTranslationCode: value => `common.ethnicity.${value}`
  },
  LEP: {
    getDimensionValueCodes: settings => codesOf(settings.limitedEnglishProficiencies),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    translateDimensionType: true
  },
  MigrantStatus: {
    getDimensionValueCodes: settings => codesOf(settings.migrantStatuses),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    translateDimensionType: true
  },
  Section504: {
    getDimensionValueCodes: settings => codesOf(settings.section504s),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    translateDimensionType: true
  },
  IEP: {
    getDimensionValueCodes: settings => codesOf(settings.individualEducationPlans),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    translateDimensionType: true
  },
  EconomicDisadvantage: {
    getDimensionValueCodes: settings => codesOf(settings.economicDisadvantages),
    getTranslationCode: value => `common.strict-boolean.${value}`,
    translateDimensionType: true
  },
  StudentEnrolledGrade: {
    getDimensionValueCodes: settings => ['yes', 'no'],
    getTranslationCode: value => `common.strict-boolean.${value}`,
    translateDimensionType: true
  }
};

@Injectable()
export class AggregateReportTableDataService {

  constructor(private definitionService: AssessmentDefinitionService) {
  }

  createSampleTable(settings: AggregateReportFormSettings): Observable<AggregateReportTable> {
    return this.definitionService.getDefinitionsByAssessmentTypeCode()
      .map(definitions => this.createSampleTableInternal(settings, definitions));
  }

  private createSampleTableInternal(settings: AggregateReportFormSettings,
                                    definitions: Map<string, AssessmentDefinition>): AggregateReportTable {

    const assessmentTypeCode = settings.assessmentType.code;
    const assessmentDefinition = definitions.get(assessmentTypeCode);
    const organizations = this.createSampleOrganizations([ ...settings.districts, ...settings.schools ].length);
    const assessmentGradeCodes = codesOf(settings.assessmentGrades);
    const schoolYears = settings.schoolYears;
    const dimensions = [ <Dimension>{ type: 'Overall' }, ...this.createDimensions(settings) ];
    const studentsTested = 100;
    const averageScaleScore = 2500;
    const averageStandardError = 50;
    const performanceLevelCounts = [];
    const performanceLevelPercents = [];
    const performanceLevelCount = Math.floor(studentsTested / assessmentDefinition.performanceLevelCount);
    const performanceLevelPercent = Math.floor(100 / assessmentDefinition.performanceLevelCount);
    for (let i = 0; i < assessmentDefinition.performanceLevelCount; i++) {
      performanceLevelCounts.push(performanceLevelCount);
      performanceLevelPercents.push(performanceLevelPercent);
    }
    const groupedPerformanceLevelCount = studentsTested * 0.5;
    const groupedPerformanceLevelCounts = [ groupedPerformanceLevelCount, groupedPerformanceLevelCount ];
// console.log(organizations.length * assessmentGradeCodes.length * schoolYears.length * dimensions.length);
    let uuid = 0;
    const rows = [];
    for (let organization of organizations) {
      for (let assessmentGradeCode of assessmentGradeCodes) {
        for (let schoolYear of schoolYears) {
          for (let dimension of dimensions) {
            rows.push({
              itemId: uuid++,
              organization: organization,
              assessmentId: undefined,
              gradeId: undefined,
              gradeCode: assessmentGradeCode,
              subjectId: undefined,
              subjectCode: undefined,
              schoolYear: schoolYear,
              avgScaleScore: averageScaleScore,
              avgStdErr: averageStandardError,
              studentsTested: studentsTested,
              performanceLevelCounts: performanceLevelCounts,
              performanceLevelPercents: performanceLevelPercents,
              groupedPerformanceLevelCounts: groupedPerformanceLevelCounts,
              groupedPerformanceLevelPercents: groupedPerformanceLevelCounts,
              dimensionType: dimension.type,
              dimensionValue: dimension.code
              performanceLevelByDisplayType: {
                Separate: {
                  Number: [1, 2, 3, 5],
                  Percent: [1, 2, 3, 5]
                },
                Grouped: {
                  Number: [1, 2],
                  Percents: [1, 2]
                }
              },
              dimension: git status

            });
          }
        }
      }
    }
    return {
      assessmentDefinition: assessmentDefinition,
      rows: rows
    };
  }

  private createDimensions(settings: AggregateReportFormSettings): Dimension[] {
    const dimensions = [];
    for (let dimensionType of settings.dimensionTypes) {
      const configuration = DimensionConfigurationByType[ dimensionType ];
      if (!configuration) {
        continue;
      }
      const codes = configuration.getDimensionValueCodes(settings);
      for (let code of codes) {
        dimensions.push({
          type: configuration.translateDimensionType ? dimensionType : undefined,
          code: configuration.getTranslationCode(code)
        });
      }
    }
    return dimensions;
  }

  private createSampleOrganizations(selectedOrganizationCount: number): Organization[] {
    const organizations: Organization[] = [];
    for (let i = 0; i < selectedOrganizationCount && i < 2; i++) {
      organizations.push(this.createSampleSchool(i + 1));
    }
    return organizations;
  }

  private createSampleSchool(id: number): School {
    const school = new DefaultSchool();
    school.id = 2;
    school.name = 'School / District ' + String(id);
    return school;
  }

}

interface Dimension {
  readonly type: string;
  readonly code?: string;
}

// when adding a new dimension type one needs to be defined here
interface DimensionConfiguration {
  readonly getDimensionValueCodes: (settings: AggregateReportFormSettings) => string[];
  readonly getTranslationCode: (dimensionCode: string) => string;
  readonly translateDimensionType?: boolean;
}


