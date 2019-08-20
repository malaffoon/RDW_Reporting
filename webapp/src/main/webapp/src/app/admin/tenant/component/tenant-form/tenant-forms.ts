import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { Property } from '../../model/property';
import { combineLatest, Observable, of } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { propertyForm } from '../../model/property-forms';
import {
  available,
  oneDatabasePerDataSource,
  onePasswordPerUser,
  tenantKey,
  uniqueDatabasePerInstance
} from './tenant-form.validators';
import { FormMode } from './tenant-form.component';
import { ordering } from '@kourge/ordering';
import { byString, Comparator } from '@kourge/ordering/comparator';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { isBlank, isNullOrBlank } from '../../../../shared/support/support';
import { showErrorsRecursive } from '../../../../shared/form/forms';
import { formFieldModified } from '../../model/form/form-fields';
import { archives } from '../../model/form/validators';
import { notBlank } from '../../../../shared/form/validators';

const byName = ordering(byString).on<Property>(
  ({ configuration: { name } }) => name
).compare;
const keyboardDebounceInMilliseconds = 300;
const configurationsValidatorsByMode: { [mode: string]: ValidatorFn[] } = {
  create: [
    onePasswordPerUser,
    oneDatabasePerDataSource,
    uniqueDatabasePerInstance,
    archives
  ],
  update: [archives]
};

interface PropertySearch {
  results: Property[];
  hasSearch: boolean;
  invalid: boolean;
}

export function tenantForm(
  mode: FormMode,
  value: TenantConfiguration,
  configurationProperties: Property[],
  localizationProperties: Property[],
  tenantKeyAvailable: (value: string) => Observable<boolean>,
  tenantIdAvailable: (value: string) => Observable<boolean>,
  tenants: TenantConfiguration[] = [],
  dataSets: DataSet[] = []
): FormGroup {
  const label = new FormControl(value.label || '', [
    Validators.required,
    notBlank
  ]);

  const description = new FormControl(value.description || '');

  const configurations = propertyForm(
    configurationProperties,
    value.configurations,
    configurationsValidatorsByMode[mode]
  );

  const localizations = propertyForm(
    localizationProperties,
    value.localizations
  );

  const sharedControls = {
    label,
    description,
    configurations,
    localizations
  };

  // setup sandbox/tenant specific form
  return new FormGroup(
    value.type === 'SANDBOX'
      ? {
          ...sharedControls,
          tenant: new FormControl(
            tenants.find(({ code }) => code === value.parentTenantCode),
            [Validators.required]
          ),
          dataSet: new FormControl(
            dataSets.find(({ id }) => id === (value.dataSet || <DataSet>{}).id),
            [Validators.required]
          )
        }
      : {
          ...sharedControls,
          key: new FormControl(
            value.code || '',
            [
              Validators.required,
              Validators.maxLength(20),
              tenantKey,
              notBlank
            ],
            mode === 'create' ? [available(tenantKeyAvailable)] : []
          ),
          id: new FormControl(
            value.id || '',
            [Validators.required, notBlank],
            mode == 'create' ? [available(tenantIdAvailable)] : []
          )
        }
  );
}

/**
 * Produces an observable of properties shared by the configuration and localization properties
 *
 * @param searchFormGroup The search parameter form
 * @param formGroup The form being searched
 * @param properties The form field metadata
 * @param submitted$ Observable that produces a signal when the form is submitted (used for configurations)
 * @param keyTransform Transform placed on keys before matching them with the search word (used for configurations)
 * @param comparator The result comparison method to use for sorting
 */
export function propertiesProvider(
  searchFormGroup: FormGroup,
  formGroup: FormGroup,
  properties: Property[],
  submitted$: Observable<boolean> = of(false),
  keyTransform: (key: string) => string = value => value,
  comparator: Comparator<Property> = byName
): Observable<PropertySearch> {
  const { controls, value } = searchFormGroup;
  return combineLatest(
    controls.search.valueChanges.pipe(
      startWith(value.search),
      debounceTime(keyboardDebounceInMilliseconds)
    ),
    controls.modified.valueChanges.pipe(startWith(value.modified)),
    controls.required != null
      ? controls.required.valueChanges.pipe(startWith(value.required))
      : of(false),
    submitted$
  ).pipe(
    map(([search, modified, required, submitted]) => {
      return {
        hasSearch: !isBlank(search) || modified || required,
        invalid:
          submitted &&
          formGroup.invalid &&
          showErrorsRecursive(formGroup, submitted),
        results: properties
          .filter(property => {
            const {
              originalValue,
              configuration,
              configuration: {
                name,
                dataType: { inputType }
              }
            } = property;
            const caseInsensitiveSearch = search.toLowerCase();
            const key = keyTransform(name);
            const formValue = formGroup.getRawValue()[name];

            // support search of input's property placeholders
            const value =
              inputType === 'input'
                ? isNullOrBlank(formValue)
                  ? originalValue
                  : formValue
                : formValue;
            return (
              (isBlank(search) ||
                (key.toLowerCase().includes(caseInsensitiveSearch) ||
                  (typeof value === 'string' &&
                    value.toLowerCase().includes(caseInsensitiveSearch)) ||
                  (Object(value) !== value &&
                    String(value)
                      .toLowerCase()
                      .includes(caseInsensitiveSearch)))) &&
              (!modified ||
                formFieldModified(inputType, value, originalValue)) &&
              (!required || configuration.required) // TODO make this conditional on form state
            );
          })
          .sort(comparator)
      };
    })
  );
}

/**
 * Searches the form for the first form field that is invalid and returns it's name
 *
 * @param formGroup The tenant form form group to search
 * @param orderedConfigurationPropertyNames The configuration property names ordered
 */
export function getFirstInvalidFormFieldName(
  formGroup: FormGroup,
  orderedConfigurationPropertyNames: string[]
): string {
  // check top level fields
  const firstInvalidFieldName = [
    'tenant',
    'dataSet',
    'key',
    'id',
    'label',
    'description'
  ].find(name => {
    const control = formGroup.controls[name];
    return control != null && control.invalid;
  });

  if (firstInvalidFieldName != null) {
    return firstInvalidFieldName;
  }

  // check configuration fields
  // using properties here because they are ordered
  const firstInvalidConfigurationPropertyName = orderedConfigurationPropertyNames.find(
    name => {
      const control = (<FormGroup>formGroup.controls.configurations).controls[
        name
      ];
      return control != null && control.invalid;
    }
  );

  if (firstInvalidConfigurationPropertyName != null) {
    return firstInvalidConfigurationPropertyName;
  }

  // found nothing
  return null;
}
