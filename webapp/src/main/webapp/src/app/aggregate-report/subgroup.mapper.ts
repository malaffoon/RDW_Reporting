import {SubgroupFilters} from "./subgroup-filters";
import {SubgroupFilterOptions} from "./subgroup-filter-options";
import {Utils} from "../shared/support/support";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class SubgroupMapper {

  constructor(private translate: TranslateService) {
  }

  createCustomSubgroup(settings: SubgroupFilters, options: SubgroupFilterOptions): any {
    const subgroups = this.createCustomSubgroups(settings, options);
    return {
      guid: Utils.newGuid(),
      uuid: subgroups.map(subgroup => subgroup.id).join(';'),
      name: subgroups.map(subgroup => subgroup.name).join(', '),
      subgroups: subgroups
    };
  }

  createCustomSubgroups(settings: SubgroupFilters, options: SubgroupFilterOptions): any[] {
    return DimensionConfigurations.reduce((subgroups, dimension) => {
      const type = dimension.type;
      const valueCodes = dimension.getDimensionValueCodes(settings) || [];
      const optionCodes = dimension.getDimensionValueCodes(options) || [];
      if (!Utils.hasEqualLength(valueCodes, optionCodes)) {
        for (const value of valueCodes) {
          subgroups.push(this.createSubgroupInternal(type, value, dimension));
        }
      }
      return subgroups;
    }, []);
  }

  createSubgroups(types: string[], settings: SubgroupFilters): any {
    const subgroups = [];
    for (const type of types) {
      const dimension = DimensionConfigurationByType[ type ];
      if (dimension) {
        const values = dimension.getDimensionValueCodes(settings);
        for (const value of values) {
          subgroups.push(this.createSubgroupInternal(type, value, dimension));
        }
      } else {
        subgroups.push(this.createSubgroupInternal(type));
      }
    }
    return subgroups;
  }

  createSubgroup(type: string, value?: any): any {
    return this.createSubgroupInternal(type, value, DimensionConfigurationByType[type]);
  }

  private createSubgroupInternal(type: string, value?: any, dimension?: DimensionConfiguration): any {
    const translate = (code) => this.translate.instant(code);
    const suffix = value && dimension ? `: ${translate(dimension.getTranslationCode(value))}` : '';
    return {
      id: `${type}:${value}`,
      type: type,
      code: value,
      name: `${translate(`common.dimension.${type}`)}${suffix}`
    };
  }

}

interface DimensionConfiguration {
  readonly type: string;
  readonly getDimensionValueCodes: (settings: any) => string[];
  readonly getTranslationCode: (dimensionCode: string) => string;
}

const DimensionConfigurations: DimensionConfiguration[] = [
  {
    type: 'Gender',
    getDimensionValueCodes: settings => settings.genders,
    getTranslationCode: value => `common.gender.${value}`
  },
  {
    type: 'Ethnicity',
    getDimensionValueCodes: settings => settings.ethnicities,
    getTranslationCode: value => `common.ethnicity.${value}`
  },
  {
    type: 'LEP',
    getDimensionValueCodes: settings => settings.limitedEnglishProficiencies,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  {
    type: 'MigrantStatus',
    getDimensionValueCodes: settings => settings.migrantStatuses,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'Section504',
    getDimensionValueCodes: settings => settings.section504s,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'IEP',
    getDimensionValueCodes: settings => settings.individualEducationPlans,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  {
    type: 'EconomicDisadvantage',
    getDimensionValueCodes: settings => settings.economicDisadvantages,
    getTranslationCode: value => `common.strict-boolean.${value}`
  },
  {
    type: 'StudentEnrolledGrade',
    getDimensionValueCodes: settings => Utils.isNullOrEmpty(settings.assessmentGrades) ? [] : [ settings.assessmentGrades[0] ],
    getTranslationCode: value => `common.enrolled-grade.${value}`
  }
];


/**
 * Dimension type code to configuration mappings.
 * These configurations help mapping backend-provided and form-provided dimension data into {Dimension}s
 */
const DimensionConfigurationByType: { [dimensionType: string]: DimensionConfiguration } = DimensionConfigurations
  .reduce((byType, dimension) => {
    byType[dimension.type] = dimension;
    return byType;
  }, {});

