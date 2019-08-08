import { studentFields } from './data/student-fields';
import { FieldConfiguration, OptionsProvider } from './field';
import { isEqual } from 'lodash';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { of } from 'rxjs';
import { StateOptionsService } from '../service/state-options.service';
import { State } from './state';
import { map } from 'rxjs/operators';
import { configurableDataElements } from './data/configurable-data-elements';

const sandboxHidden = type => type === 'SANDBOX';

const byLabel = ordering(byString).on(({ label }) => label).compare;

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

const assessmentTypeOptions = ({ translateService }) =>
  of(
    ['sum', 'ica', 'iab'].map(value => ({
      value,
      label: translateService.instant(
        `common.assessment-type.${value}.short-name`
      )
    }))
  );

const languageOptions = ({ translateService }) =>
  of(
    ['en']
      .map(value => ({
        value,
        label: translateService.instant(`common.language.${value}`)
      }))
      .sort(byLabel)
  );

const reportLanguageOptions = ({ translateService }) =>
  of(
    ['en', 'es']
      .map(value => ({
        value,
        label: translateService.instant(`common.language.${value}`)
      }))
      .sort(byLabel)
  );

const stateOptions: OptionsProvider<State> = ({ injector }) =>
  injector
    .get(StateOptionsService)
    .getStates()
    .pipe(
      map(states =>
        states.map(value => ({
          label: value.name,
          value
        }))
      )
    );

const studentFieldOptions = () =>
  of(
    ['Enabled', 'Admin', 'Disabled'].map(value => ({
      value,
      label: value
    }))
  );

const examProcessorRequiredDataElements = () =>
  of(
    configurableDataElements.map(value => ({
      value,
      label: value
    }))
  );

export const fieldConfigurationsByKey: { [key: string]: FieldConfiguration } = {
  'aggregate.assessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
    // TODO enforce one+ values selected
  },
  'aggregate.statewideUserAssessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
    // TODO enforce one+ values selected
  },
  'aggregate.stateAggregateAssessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions
    // TODO enforce one+ values selected
  },
  'archive.pathPrefix': {
    dataType: 'string',
    required: true,
    hidden: sandboxHidden
  },
  'archive.uriRoot': {
    dataType: 'archive-uri',
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
    options: reportLanguageOptions
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
  }, {}),
  'validation.requiredDataElements': {
    dataType: 'enumeration-list',
    options: examProcessorRequiredDataElements
  }
};
