import { languageCodes } from './data/languages';
import { states } from './data/state';
import { studentFields } from './data/student-fields';
import { FieldConfiguration } from './field';
import { isEqual } from 'lodash';

const assessmentTypeOptions = translateService =>
  ['sum', 'ica', 'iab'].map(value => ({
    value,
    label: translateService.instant(
      `common.assessment-type.${value}.short-name`
    )
  }));

const stateOptions = () =>
  states.map(({ name: label, abbreviation: value }) => ({
    value: {
      code: value,
      name: label
    },
    label
  }));

const languageOptions = translateService =>
  languageCodes.map(value => ({
    value,
    label: translateService.instant(`common.language.${value}`)
  }));

const studentFieldOptions = () =>
  ['Enabled', 'Admin', 'Disabled'].map(value => ({
    value,
    label: value
  }));

export const fieldConfigurationsByKey: { [key: string]: FieldConfiguration } = {
  'aggregate.assessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
  },
  'aggregate.statewideUserAssessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
  },
  'aggregate.stateAggregateAssessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
  },
  'archive.uriRoot': {
    dataType: 'uri'
  },
  'archive.s3SecretKey': {
    dataType: 'password'
  },
  'archive.configuredFile': {
    dataType: 'boolean'
  },
  'archive.configuredS3': {
    dataType: 'boolean'
  },
  ...['reporting', 'warehouse', 'olap', 'migrate'].reduce((sources, source) => {
    [`datasources.${source}_ro`, `datasources.${source}_rw`].forEach(
      basePath => {
        sources[`${basePath}.url`] = {
          dataType: 'uri'
        };
        sources[`${basePath}.urlParts.database`] = {
          dataType: 'database',
          lowercase: true
        };
        sources[`${basePath}.username`] = {
          dataType: 'username',
          required: true,
          lowercase: true
        };
        sources[`${basePath}.password`] = {
          dataType: 'password',
          required: true
        };
        sources[`${basePath}.testWhileIdle`] = {
          dataType: 'boolean'
        };
        sources[`${basePath}.initialSize`] = {
          dataType: 'integer'
        };
        sources[`${basePath}.maxActive`] = {
          dataType: 'integer'
        };
        sources[`${basePath}.minIdle`] = {
          dataType: 'integer'
        };
        sources[`${basePath}.removeAbandoned`] = {
          dataType: 'boolean'
        };
        sources[`${basePath}.removeAbandonedTimeout`] = {
          dataType: 'integer'
        };
        sources[`${basePath}.logAbandoned`] = {
          dataType: 'boolean'
        };
      }
    );
    return sources;
  }, {}),
  'reporting.interpretiveGuideUrl': {
    dataType: 'url-fragment'
  },
  'reporting.accessDeniedUrl': {
    dataType: 'url-fragment'
  },
  'reporting.landingPageUrl': {
    dataType: 'url-fragment'
  },
  'reporting.minItemDataYear': {
    dataType: 'integer'
  },
  'reporting.percentileDisplayEnabled': {
    dataType: 'boolean'
  },
  'reporting.reportLanguages': {
    dataType: 'enumeration-list',
    options: languageOptions
  },
  'reporting.schoolYear': {
    dataType: 'integer'
  },
  // flatten state
  'reporting.state': {
    dataType: 'enumeration',
    required: true,
    options: stateOptions,
    equals: isEqual
  },
  'reporting.transferAccessEnabled': {
    dataType: 'boolean'
  },
  'reporting.translationLocation': {
    dataType: 'uri'
  },
  'reporting.uiLanguages': {
    dataType: 'enumeration-list',
    options: languageOptions
  },
  'reporting.userGuideUrl': {
    dataType: 'url-fragment'
  },
  'reporting.targetReport.insufficientDataCutoff': {
    dataType: 'float'
  },
  'reporting.targetReport.minNumberOfStudents': {
    dataType: 'integer'
  },
  ...studentFields.reduce((configurations, studentField) => {
    configurations[`reporting.studentFields.${studentField}`] = {
      dataType: 'enumeration',
      options: studentFieldOptions,
      equals: (a, b) => a.toLowerCase() === b.toLowerCase()
    };
    return configurations;
  }, {})
};
