import { languageCodes } from './data/languages';
import { states } from './data/state';
import { studentFields } from './data/student-fields';
import { FieldConfiguration } from './field';
import { isEqual } from 'lodash';

const sandboxHidden = type => type === 'SANDBOX';

function dataSources(
  sources: string[],
  mapper: (source: string) => { [key: string]: FieldConfiguration }
): { [key: string]: FieldConfiguration } {
  return sources.reduce((configurations, source) => {
    return {
      ...configurations,
      ...[`datasources.${source}_ro`, `datasources.${source}_rw`].reduce(
        (subConfigurations, path) => ({
          ...subConfigurations,
          ...mapper(path)
        }),
        {}
      )
    };
  }, {});
}

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
  'archive.pathPrefix': {
    dataType: 'string',
    required: true
  },
  'archive.uriRoot': {
    dataType: 's3uri'
  },
  'archive.s3AccessKey': {
    dataType: 'string'
  },
  'archive.s3RegionStatic': {
    dataType: 'string'
  },
  'archive.s3SecretKey': {
    dataType: 'password'
  },
  'archive.s3sse': {
    dataType: 'string'
  },
  ...dataSources(['reporting', 'warehouse', 'migrate'], dataSource => ({
    [`${dataSource}.urlParts.database`]: {
      dataType: 'string',
      required: true,
      lowercase: true
    },
    [`${dataSource}.username`]: {
      dataType: 'username',
      required: true,
      lowercase: true
    },
    [`${dataSource}.password`]: {
      dataType: 'password',
      required: true
    }
  })),
  ...dataSources(['olap'], dataSource => ({
    [`${dataSource}.schemaSearchPath`]: {
      dataType: 'string',
      required: true,
      lowercase: true
    },
    [`${dataSource}.username`]: {
      dataType: 'username',
      required: true,
      lowercase: true
    },
    [`${dataSource}.password`]: {
      dataType: 'password',
      required: true
    }
  })),
  'reporting.accessDeniedUrl': {
    dataType: 'string', // not url-fragment b/c of spring forward: prefix
    hidden: sandboxHidden
  },
  'reporting.interpretiveGuideUrl': {
    dataType: 'url-fragment'
  },
  'reporting.landingPageUrl': {
    dataType: 'string' // not url-fragment b/c of spring forward: prefix
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
    equals: isEqual,
    hidden: sandboxHidden
  },
  'reporting.transferAccessEnabled': {
    dataType: 'boolean'
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
