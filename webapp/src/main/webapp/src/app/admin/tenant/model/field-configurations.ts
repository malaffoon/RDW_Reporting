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

const primitiveSetEquals = (a, b) =>
  isEqual(a != null ? a.slice().sort() : [], b != null ? b.slice().sort() : []);

const studentFieldOptions = () =>
  ['Enabled', 'Admin', 'Disabled'].map(value => ({
    value,
    label: value
  }));

export const fieldConfigurationsByKey: { [key: string]: FieldConfiguration } = {
  'aggregate.assessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
    // TODO add not blank requirement
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
    required: true,
    hidden: sandboxHidden
  },
  'archive.uriRoot': {
    dataType: 's3uri',
    hidden: sandboxHidden
  },
  'archive.s3AccessKey': {
    dataType: 'string',
    hidden: sandboxHidden
  },
  'archive.s3RegionStatic': {
    dataType: 'string',
    hidden: sandboxHidden
  },
  'archive.s3SecretKey': {
    dataType: 'password',
    hidden: sandboxHidden
  },
  'archive.s3sse': {
    dataType: 'string',
    hidden: sandboxHidden
  },
  ...dataSources(['reporting', 'warehouse', 'migrate'], dataSource => ({
    [`${dataSource}.urlParts.database`]: {
      dataType: 'string',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${dataSource}.username`]: {
      dataType: 'username',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${dataSource}.password`]: {
      dataType: 'password',
      required: true,
      hidden: sandboxHidden
    }
  })),
  ...dataSources(['olap'], dataSource => ({
    [`${dataSource}.schemaSearchPath`]: {
      dataType: 'string',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${dataSource}.username`]: {
      dataType: 'username',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${dataSource}.password`]: {
      dataType: 'password',
      required: true,
      hidden: sandboxHidden
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
    dataType: 'positive-integer'
  },
  'reporting.percentileDisplayEnabled': {
    dataType: 'boolean'
  },
  'reporting.schoolYear': {
    dataType: 'positive-integer'
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
  'reporting.reportLanguages': {
    dataType: 'enumeration-list',
    options: languageOptions
  },
  'reporting.uiLanguages': {
    dataType: 'enumeration-list',
    options: languageOptions
  },
  'reporting.userGuideUrl': {
    dataType: 'url-fragment'
  },
  'reporting.targetReport.insufficientDataCutoff': {
    dataType: 'positive-decimal'
  },
  'reporting.targetReport.minNumberOfStudents': {
    dataType: 'positive-integer'
  },
  ...studentFields.reduce((configurations, studentField) => {
    configurations[`reporting.studentFields.${studentField}`] = {
      dataType: 'enumeration',
      options: studentFieldOptions,
      equals: (a, b) =>
        (a || 'Enabled').toLowerCase() === (b || 'Enabled').toLowerCase()
    };
    return configurations;
  }, {})
};
