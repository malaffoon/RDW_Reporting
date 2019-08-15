import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { of } from 'rxjs';
import { OptionsProvider } from './field';
import { State } from './state';
import { StateOptionsService } from '../service/state-options.service';
import { map } from 'rxjs/operators';
import { configurableDataElements } from './data/configurable-data-elements';

const byLabel = ordering(byString).on(({ label }) => label).compare;

export const assessmentTypeOptions = ({ translateService }) =>
  of(
    ['sum', 'ica', 'iab'].map(value => ({
      value,
      label: translateService.instant(
        `common.assessment-type.${value}.short-name`
      )
    }))
  );

export const languageOptions = ({ translateService }) =>
  of(
    ['en']
      .map(value => ({
        value,
        label: translateService.instant(`common.language.${value}`)
      }))
      .sort(byLabel)
  );

export const reportLanguageOptions = ({ translateService }) =>
  of(
    ['en', 'es']
      .map(value => ({
        value,
        label: translateService.instant(`common.language.${value}`)
      }))
      .sort(byLabel)
  );

export const stateOptions: OptionsProvider<State> = ({ injector }) =>
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

export const studentFieldOptions = () =>
  of(
    ['Enabled', 'Admin', 'Disabled'].map(value => ({
      value,
      label: value
    }))
  );

export const requiredDataElementOptions = () =>
  of(
    configurableDataElements.map(value => ({
      value,
      label: value
    }))
  );
