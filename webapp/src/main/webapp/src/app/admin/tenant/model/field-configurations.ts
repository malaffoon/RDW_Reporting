import { languageCodes } from './data/languages';
import { states } from './data/state';

const assessmentTypes = translateService =>
  ['sum', 'ica', 'iab'].map(value => ({
    value,
    label: translateService.instant(
      `common.assessment-type.${value}.short-name`
    )
  }));

const stateOptions = translateService =>
  states.map(({ name: label, abbreviation: value }) => ({
    value,
    label
  }));

const languageOptions = translateService =>
  languageCodes.map(value => ({
    value,
    label: translateService.instant(`common.language.${value}`)
  }));

const studentFields = translateService =>
  Object.entries(translateService.instant('common.student-field')).map(
    ([value, label]) => ({ value, label })
  );

const studentFieldValues = () =>
  ['Enabled', 'Admin', 'Disabled'].map(value => ({ value }));

export const fieldConfigurationsByKey = {
  'aggregate.assessmentTypes': {
    dataType: 'enumeration-list',
    values: assessmentTypes
  },
  'aggregate.statewideUserAssessmentTypes': {
    dataType: 'enumeration-list',
    values: assessmentTypes
  },
  'aggregate.stateAggregateAssessmentTypes': {
    dataType: 'enumeration-list',
    values: assessmentTypes
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
  ...['reporting', 'warehouse', 'olap', 'migrate_olap'].reduce(
    (sources, source) => {
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
    },
    {}
  ),
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
    values: languageOptions
  },
  'reporting.schoolYear': {
    dataType: 'integer'
  },
  // flatten state
  'reporting.state': {
    dataType: 'enumeration',
    required: true,
    values: stateOptions
  },
  'reporting.transferAccessEnabled': {
    dataType: 'boolean'
  },
  'reporting.translationLocation': {
    dataType: 'uri'
  },
  'reporting.uiLanguages': {
    dataType: 'enumeration-list',
    values: languageOptions
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
  'reporting.studentFields': {
    dataType: 'map',
    keys: studentFields,
    values: studentFieldValues
  }
};
