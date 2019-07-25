import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { showErrors, showErrorsRecursive } from '../../../../shared/form/forms';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import {
  configurationsFormGroup,
  toTreeNodes
} from '../property-override-tree-table/property-override-tree-table.component';
import { localizationsFormGroup } from '../property-override-table/property-override-table.component';
import {
  emptyToNull,
  isBlank,
  rightDifference,
  unflatten,
  valued
} from '../../../../shared/support/support';
import { Property } from '../../model/property';
import { toConfigurationProperty, toProperty } from '../../model/properties';
import { TreeNode } from 'primeng/api';
import { keyBy } from 'lodash';
import {
  available,
  onePasswordPerUser,
  tenantKey
} from './tenant-form.validators';
import { TranslateService } from '@ngx-translate/core';
import { states } from '../../model/data/state';
import { fieldRequired, normalizeFieldValue } from '../../model/fields';
import { notBlank } from '../../../../shared/validator/custom-validators';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { configurationFormFields } from '../../model/fields';

export type FormMode = 'create' | 'update';
const keyboardDebounceInMilliseconds = 300;
const byKey = ordering(byString).on(([key]) => key).compare;

export function tenantFormGroup(
  value: TenantConfiguration,
  configurationDefaults: any,
  localizationDefaults: any,
  tenantKeyAvailable: (value: string) => Observable<boolean>,
  tenants: TenantConfiguration[] = [],
  dataSets: DataSet[] = []
): FormGroup {
  const label = new FormControl(value.label || '', [
    Validators.required,
    notBlank
  ]);

  const description = new FormControl(value.description || '');

  const configurations = configurationsFormGroup(
    value.type,
    configurationDefaults,
    value.configurations,
    [onePasswordPerUser]
  );

  const localizations = localizationsFormGroup(
    localizationDefaults,
    value.localizations
  );

  // setup sandbox/tenant specific form
  return new FormGroup(
    value.type === 'SANDBOX'
      ? {
          label,
          description,
          dataSet: new FormControl(
            dataSets.find(({ id }) => id === (value.dataSet || <DataSet>{}).id),
            [Validators.required]
          ),
          tenant: new FormControl(
            tenants.find(({ code }) => code === value.parentTenantCode),
            [Validators.required]
          ),
          configurations,
          localizations
        }
      : {
          key: new FormControl(
            value.code || '',
            [
              Validators.required,
              Validators.maxLength(20),
              tenantKey,
              notBlank
            ],
            [available(tenantKeyAvailable)]
          ),
          id: new FormControl(value.id || '', [Validators.required, notBlank]),
          label,
          description,
          configurations,
          localizations
        }
  );
}

interface PropertySearch<T> {
  results: [string, T][];
  hasSearch: boolean;
  invalid: boolean;
}

/**
 * Produces an observable of properties shared by the configuration and localization properties
 *
 * @param searchFormGroup The search parameter form
 * @param formGroup The form being searched
 * @param defaults The default values of the form
 * @param submitted$ Observable that produces a signal when the form is submitted (used for configurations)
 * @param keyTransform Transform placed on keys before matching them with the search word (used for configurations)
 */
function toPropertiesProvider<T = any>(
  searchFormGroup: FormGroup,
  formGroup: FormGroup,
  defaults: { [key: string]: T },
  submitted$: Observable<boolean> = of(false),
  keyTransform: (key: string) => string = value => value
): Observable<PropertySearch<T>> {
  const { controls, value } = searchFormGroup;
  const entries = Object.entries(defaults);
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
        results: entries
          .filter(([controlKey, defaultValue]) => {
            const caseInsensitiveSearch = search.toLowerCase();
            const key = keyTransform(controlKey);
            const value = formGroup.controls[controlKey].value;
            return (
              (isBlank(search) ||
                (key.toLowerCase().includes(caseInsensitiveSearch) ||
                  (typeof value === 'string' &&
                    value.toLowerCase().includes(caseInsensitiveSearch)) ||
                  (Object(value) !== value &&
                    String(value)
                      .toLowerCase()
                      .includes(caseInsensitiveSearch)))) &&
              (!modified || emptyToNull(value) !== defaultValue) &&
              (!required || fieldRequired(controlKey))
            );
          })
          .sort(byKey)
      };
    })
  );
}

function stateToTenant(
  initialValue: TenantConfiguration,
  configurationDefaults: any,
  localizationDefaults: any,
  formValue: any,
  mode: FormMode
): TenantConfiguration {
  const { code: tenantCode, id: tenantId, type } = initialValue;
  const {
    id,
    key: code,
    label,
    description,
    tenant,
    dataSet,
    configurations = {},
    localizations = {}
  } = formValue;

  const createMode = mode === 'create';
  return {
    type,
    code: createMode ? code : tenantCode,
    id: createMode ? id : tenantId,
    label,
    description,
    parentTenantCode: (tenant || <any>{}).code,
    dataSet,
    configurations: valued(
      rightDifference(configurationDefaults, configurations)
    ),
    localizations: valued(rightDifference(localizationDefaults, localizations))
  };
}

// lookup values
const datasourcePattern = /^datasources\.(\w+)\..+$/;
const defaultDatabaseNameProviderByDatasource = {
  migrate: key => `migrate_olap_${key}`,
  olap: key => `reporting_${key}`, // the special case
  reporting: key => `reporting_${key}`,
  warehouse: key => `warehouse_${key}`
};

// TODO only issue with this is this doesn't change the defaultValue so the values
// get marked as modified and using FormControl.dirty isn't enough because it doesn't
// detect that the value is the same as it started
// apply default passwords for sandboxes based on key
function setDefaultDatabaseNameAndUsername(
  formGroup: FormGroup,
  inputKey: string
): void {
  const key = (inputKey || '').toLowerCase();
  const defaultUsername = key;

  Object.entries(formGroup.controls)
    // find datasource controls
    .filter(([key]) => datasourcePattern.test(key))
    // extract the datasource names
    .map(([key]) => datasourcePattern.exec(key)[1])
    // reduce to a set of the names
    .reduce((sources, source) => {
      if (!sources.includes(source)) {
        sources.push(source);
      }
      return sources;
    }, [])
    // for every datasource name apply defaults
    .forEach(source => {
      const usernameControl =
        formGroup.controls[`datasources.${source}.username`];
      if (usernameControl.pristine) {
        usernameControl.patchValue(defaultUsername);
      }

      const databaseNameControl =
        formGroup.controls[`datasources.${source}.urlParts.database`];
      if (databaseNameControl.pristine) {
        const sourceName = source.replace(/_r(o|w)$/, '');
        const defaultDatabaseName = defaultDatabaseNameProviderByDatasource[
          sourceName
        ](key);
        databaseNameControl.patchValue(defaultDatabaseName);
      }
    });
}

function setDefaultState(control: AbstractControl, value: string): void {
  const state = states.find(
    ({ abbreviation }) => abbreviation.toLowerCase() === value.toLowerCase()
  );
  if (state != null && control.pristine) {
    control.patchValue({
      code: state.abbreviation,
      name: state.name
    });
  }
}

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.less']
})
export class TenantFormComponent implements OnChanges, OnDestroy {
  readonly showErrors = showErrors;

  @Input()
  tenantKeyAvailable: (value: string) => Observable<boolean>;

  @Input()
  mode: FormMode;

  @Input()
  value: TenantConfiguration;

  @Input()
  tenants: TenantConfiguration[];

  @Input()
  dataSets: DataSet[];

  @Input()
  configurationDefaults: any;

  @Input()
  localizationDefaults: any;

  @Input()
  writable: boolean;

  @Output()
  create: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Output()
  update: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Output()
  delete: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Input()
  set configurationOpen(value: boolean) {
    this.configurationsOpen$.next(value);
  }

  @Input()
  localizationOpen: boolean = false;

  @Input()
  requiredConfiguration: boolean;

  @Input()
  showRequiredFilter: boolean; // only show on create mode and only if there

  configurationControlsFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    required: new FormControl(false),
    modified: new FormControl(false)
  });
  configurations$: Observable<TreeNode[]>;

  localizationControlsFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    modified: new FormControl(false)
  });
  localizations$: Observable<Property[]>;
  formGroup: FormGroup;
  configurationsOpen$: Subject<boolean> = new BehaviorSubject(false);
  submitted$: Subject<boolean> = new BehaviorSubject(false);
  destroyed$: Subject<void> = new Subject();

  constructor(private translateService: TranslateService) {}

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      const emitter = this.mode === 'create' ? this.create : this.update;
      emitter.emit(
        stateToTenant(
          this.value,
          this.configurationDefaults,
          this.localizationDefaults,
          this.formGroup.value,
          this.mode
        )
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      mode,
      value,
      tenants,
      dataSets,
      configurationDefaults,
      localizationDefaults,
      tenantKeyAvailable,
      requiredConfiguration
    } = this;

    if (
      value != null &&
      mode != null &&
      configurationDefaults != null &&
      localizationDefaults != null &&
      tenantKeyAvailable != null &&
      requiredConfiguration != null &&
      (value.type !== 'SANDBOX' || (tenants != null && dataSets != null))
    ) {
      this.formGroup = tenantFormGroup(
        value,
        configurationDefaults,
        localizationDefaults,
        tenantKeyAvailable,
        tenants,
        dataSets
      );

      // set the defaults on the formGroup
      this.configurationControlsFormGroup.patchValue({
        required: this.requiredConfiguration
      });

      this.configurations$ = toPropertiesProvider(
        this.configurationControlsFormGroup as FormGroup,
        this.formGroup.controls.configurations as FormGroup,
        {
          ...configurationFormFields(this.value.type),
          ...configurationDefaults // should normalize these? but these are now sparse no?
        },
        this.submitted$,
        key => (/^\w+\.(.*)$/.exec(key) || ['', ''])[1] // only match last segment of key
      ).pipe(
        takeUntil(this.destroyed$),
        map(({ results, hasSearch, invalid }) => {
          const properties = results.map(([key, originalValue]) => {
            // in create mode all props can be set
            // in update mode only aggregate and reporting props can be set
            const writable =
              this.writable &&
              (this.mode === 'create' ||
                /^(aggregate|reporting)\..+$/.test(key));

            // correct boolean comparisons
            const normalizedOriginalValue = normalizeFieldValue(
              key,
              originalValue
            );

            return toConfigurationProperty(
              key,
              normalizedOriginalValue,
              writable,
              this.translateService
            );
          });
          const flattened = keyBy(properties, ({ key }) => key);
          const unflattened = unflatten(flattened);
          return toTreeNodes(unflattened, hasSearch || invalid);
        })
      );

      this.localizations$ = toPropertiesProvider(
        this.localizationControlsFormGroup as FormGroup,
        this.formGroup.controls.localizations as FormGroup,
        localizationDefaults,
        of(false),
        key => key.replace(/\./g, '')
      ).pipe(
        takeUntil(this.destroyed$),
        map(({ results }) =>
          results.map(([key, defaultValue]) => toProperty(key, defaultValue))
        )
      );

      // open invalid sections up
      this.submitted$.pipe(takeUntil(this.destroyed$)).subscribe(submitted => {
        if (submitted && this.formGroup.controls.configurations.invalid) {
          this.configurationsOpen$.next(true);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onTenantChange(tenant: TenantConfiguration): void {
    // TODO should this not override non-pristine values?
    // set form values to tenant values
    this.formGroup.patchValue({
      configurations: configurationsFormGroup(
        this.configurationDefaults,
        tenant.configurations
      ),
      localizations: localizationsFormGroup(
        this.localizationDefaults,
        tenant.localizations
      )
    });
  }

  // TODO debounce this?
  onKeyInput(value: string): void {
    setDefaultDatabaseNameAndUsername(
      this.formGroup.controls.configurations as FormGroup,
      value
    );
  }

  onIdInput(value: string): void {
    setDefaultState(
      (this.formGroup.controls.configurations as FormGroup).controls[
        'reporting.state'
      ],
      value
    );
  }
}
