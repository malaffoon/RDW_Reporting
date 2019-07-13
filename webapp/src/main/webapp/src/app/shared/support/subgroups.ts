import { TranslateService } from '@ngx-translate/core';
import { isNullOrEmpty } from './support';
import { DimensionGroup, DimensionValue, Subgroup } from '../model/subgroup';
import { SubgroupFilters } from '../model/subgroup-filters';
import { SubgroupItem } from '../model/subgroup-item';

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
    /** @deprecated */
    type: 'LEP',
    getDimensionValueCodes: settings => settings.limitedEnglishProficiencies,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    /** @deprecated */
    type: 'ELAS',
    getDimensionValueCodes: settings =>
      settings.englishLanguageAcquisitionStatuses,
    getTranslationCode: value => `common.elas.${value}`
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
    /** @deprecated */
    type: 'Language',
    getDimensionValueCodes: settings => settings.languages,
    getTranslationCode: value => `common.languages.${value}`
  },
  {
    /** @deprecated */
    type: 'IEP',
    getDimensionValueCodes: settings => settings.individualEducationPlans,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'EconomicDisadvantage',
    getDimensionValueCodes: settings => settings.economicDisadvantages,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'StudentEnrolledGrade',
    getDimensionValueCodes: settings =>
      isNullOrEmpty(settings.assessmentGrades)
        ? []
        : [settings.assessmentGrades[0]],
    getTranslationCode: value => `common.enrolled-grade.${value}`
  },
  {
    /** @deprecated */
    type: 'MilitaryConnectedCode',
    getDimensionValueCodes: settings => settings.militaryConnectedCodes,
    getTranslationCode: value => `common.military-connected-code.${value}`
  }
];

const DimensionConfigurationsWithAliases: DimensionConfiguration[] = [
  ...DimensionConfigurations,
  {
    type: 'LimitedEnglishProficiency',
    getDimensionValueCodes: settings => settings.limitedEnglishProficiencies,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'EnglishLanguageAcquisitionStatus',
    getDimensionValueCodes: settings =>
      settings.englishLanguageAcquisitionStatuses,
    getTranslationCode: value => `common.elas.${value}`
  },
  {
    type: 'PrimaryLanguage',
    getDimensionValueCodes: settings => settings.languages,
    getTranslationCode: value => `common.languages.${value}`
  },
  {
    type: 'IndividualEducationPlan',
    getDimensionValueCodes: settings => settings.individualEducationPlans,
    getTranslationCode: value => `common.boolean.${value}`
  },
  {
    type: 'MilitaryStudentIdentifier',
    getDimensionValueCodes: settings => settings.militaryConnectedCodes,
    getTranslationCode: value => `common.military-connected-code.${value}`
  }
];

/**
 * Dimension type code to configuration mappings.
 * These configurations help mapping backend-provided and form-provided dimension data into {Dimension}s
 */
const DimensionConfigurationByType: {
  [dimensionType: string]: DimensionConfiguration;
} = DimensionConfigurationsWithAliases.reduce((byType, dimension) => {
  byType[dimension.type] = dimension;
  return byType;
}, {});

export function subgroup(
  dimensionGroups: DimensionGroup[],
  translateService: TranslateService
): Subgroup {
  return {
    id: dimensionGroups
      .map(
        dimensionGroup =>
          `${dimensionGroup.type}:${dimensionGroup.values
            .map(value => value.code)
            .join(',')}`
      )
      .join(';'),
    name: dimensionGroups
      .map(dimensionGroup => {
        const typeName = translateService.instant(
          `common.dimension-short-name.${dimensionGroup.type}`
        );
        const valueNames = dimensionGroup.values
          .map(value => translateService.instant(value.translationCode))
          .join(', ');
        return typeName + (valueNames.length ? ': ' : '') + valueNames;
      })
      .join(', '),
    dimensionGroups: dimensionGroups.concat()
  };
}

export function overallSubgroup(translateService: TranslateService): Subgroup {
  return subgroup(
    [
      {
        type: 'Overall',
        values: []
      }
    ],
    translateService
  );
}

export function subgroupFromTypeAndCode(
  type: string,
  code: string,
  translateService: TranslateService
): Subgroup {
  const configuration = DimensionConfigurationByType[type];
  const values =
    configuration != null
      ? [
          {
            code: code,
            translationCode: configuration.getTranslationCode(code)
          }
        ]
      : [];

  return subgroup(
    [
      {
        type: type,
        values: values
      }
    ],
    translateService
  );
}

export function subgroupFromFilters(
  input: SubgroupFilters,
  dimensionTypes: string[],
  translateService: TranslateService
): Subgroup {
  const dimensionGroups: DimensionGroup[] = (
    dimensionTypes || DimensionConfigurations.map(({ type }) => type)
  ).reduce((groups, type) => {
    const configuration = DimensionConfigurationByType[type];
    const values = (configuration.getDimensionValueCodes(input) || []).map(
      code =>
        <DimensionValue>{
          code: code,
          translationCode: configuration.getTranslationCode(code)
        }
    );
    if (values.length) {
      groups.push({
        type: type,
        values: values
      });
    }
    return groups;
  }, []);

  return subgroup(dimensionGroups, translateService);
}

export function subgroupPermutationsFromFilters(
  input: SubgroupFilters,
  dimensionTypes: string[],
  translateService: TranslateService
): Subgroup[] {
  return dimensionTypes
    .map(type => DimensionConfigurationByType[type])
    .reduce((subgroups, configuration) => {
      subgroups.push(
        ...(
          reduceLanguageDimensionCodes(
            configuration.getDimensionValueCodes(input),
            configuration.type,
            4
          ) || []
        ).map(code =>
          subgroup(
            [
              {
                type: configuration.type,
                values: [
                  {
                    code: code,
                    translationCode: configuration.getTranslationCode(code)
                  }
                ]
              }
            ],
            translateService
          )
        )
      );
      return subgroups;
    }, []);
}

/**
 * Reduces the number of languageCodes returned. Grabs a random 'numLangs'-1 languages from the array and
 * adds the first language (should be 'eng' for English) to the front of the returned array
 */
export function reduceLanguageDimensionCodes(
  codes: string[],
  configurationType: string,
  numLangs: number
): string[] {
  if (configurationType === 'Language' && codes.length > numLangs) {
    let shuffled = codes
      .slice(1, codes.length - 1)
      .sort(() => 0.5 - Math.random());
    shuffled.unshift(codes[0]); //add first element to the beginning (should be 'eng')
    return shuffled.slice(0, numLangs);
  }
  return codes;
}

export function subgroupItemFromFilters(
  input: SubgroupFilters,
  dimensionTypes: string[],
  translateService: TranslateService
): SubgroupItem {
  return {
    source: input,
    subgroup: subgroupFromFilters(input, dimensionTypes, translateService)
  };
}
