import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { showErrors, showErrorsRecursive } from '../../../../shared/form/forms';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  map,
  mergeMap,
  startWith,
  takeUntil
} from 'rxjs/operators';
import {
  configurationsFormGroup,
  toTreeNodes
} from '../property-override-tree-table/property-override-tree-table.component';
import { localizationsFormGroup } from '../property-override-table/property-override-table.component';
import {
  isBlank,
  rightDifference,
  unflatten,
  valued
} from '../../../../shared/support/support';
import { Property } from '../../model/property';
import {
  lowercase,
  toConfigurationProperty,
  toProperty
} from '../../model/properties';
import { TreeNode } from 'primeng/api';
import { keyBy } from 'lodash';
import {
  available,
  onePasswordPerUser,
  tenantKey
} from './tenant-form.validators';

export type FormMode = 'create' | 'update';
const keyboardDebounceInMilliseconds = 300;

export function tenantFormGroup(
  value: TenantConfiguration,
  configurationDefaults: any,
  localizationDefaults: any,
  tenantKeyAvailable: (value: string) => Observable<boolean>,
  tenants: TenantConfiguration[] = [],
  dataSets: DataSet[] = []
): FormGroup {
  const label = new FormControl(value.label || '', [Validators.required]);

  const description = new FormControl(value.description || '');

  const configurations = configurationsFormGroup(
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
            [Validators.required, Validators.maxLength(20), tenantKey],
            [available(tenantKeyAvailable)]
          ),
          id: new FormControl(value.id || '', [Validators.required]),
          label,
          description,
          configurations,
          localizations
        }
  );
}

function toPropertiesProvider<T = any>(
  searchFormGroup: FormGroup,
  formGroup: FormGroup,
  defaults: { [key: string]: T }
): Observable<[string, T][]> {
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
      : of(false)
  ).pipe(
    map(
      ([search, modified, required]) =>
        entries.filter(([key, defaultValue]) => {
          const caseInsensitiveSearch = search.toLowerCase();
          const value = formGroup.controls[key].value;
          return (
            (isBlank(search) ||
              (key.toLowerCase().includes(caseInsensitiveSearch) ||
                (typeof value === 'string' &&
                  value.toLowerCase().includes(caseInsensitiveSearch)) ||
                (Object(value) !== value &&
                  String(value)
                    .toLowerCase()
                    .includes(caseInsensitiveSearch)))) &&
            (!modified || value !== defaultValue) &&
            (!required || /username|password/g.test(key)) // TODO this should really come from metadata
          );
        })
      // TODO sort?
      // .sort(ordering(byString).on(([key]) => key).compare)
    )
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
    configurations: lowercase(
      valued(rightDifference(configurationDefaults, configurations))
    ),
    localizations: valued(rightDifference(localizationDefaults, localizations))
  };
}

// lookup values
const datasourcePattern = /^datasources\.(\w+)\..+$/;
const defaultDatabaseNameProviderByDatasource = {
  migrate_olap: key => `migrate_olap_${key}`,
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
        const sourceName = source.replace(/_r[o|w]$/, '');
        const defaultDatabaseName = defaultDatabaseNameProviderByDatasource[
          sourceName
        ](key);
        databaseNameControl.patchValue(defaultDatabaseName);
      }
    });
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
  configurationOpen: boolean = false;

  @Input()
  localizationOpen: boolean = false;

  @Input()
  requiredConfiguration: boolean;

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
  readonlyGroups: string[] = [];
  formGroup: FormGroup;
  submitted$: Subject<boolean> = new Subject();
  destroyed$: Subject<void> = new Subject();

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
      this.readonlyGroups =
        this.mode === 'create' ? [] : ['datasources', 'archive'];

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

      // hack to get config to open on search
      const configurationHasSearch$ = this.configurationControlsFormGroup.valueChanges.pipe(
        takeUntil(this.destroyed$),
        startWith(this.configurationControlsFormGroup.value),
        map(
          ({ search, required, modified }) =>
            !isBlank(search) || required || modified
        )
      );

      const configurationsGroup = this.formGroup.controls.configurations;
      const configurationsInvalid$ = this.submitted$.pipe(
        takeUntil(this.destroyed$),
        startWith(false),
        map(
          submitted =>
            submitted &&
            configurationsGroup.status === 'INVALID' &&
            showErrorsRecursive(configurationsGroup, submitted)
        )
      );

      const expandConfigurations$ = combineLatest(
        configurationHasSearch$,
        configurationsInvalid$
      ).pipe(
        takeUntil(this.destroyed$),
        map(([hasSearch, invalid]) => hasSearch || invalid)
      );

      this.configurations$ = toPropertiesProvider(
        this.configurationControlsFormGroup as FormGroup,
        this.formGroup.controls.configurations as FormGroup,
        configurationDefaults
      ).pipe(
        takeUntil(this.destroyed$),
        mergeMap(entries =>
          expandConfigurations$.pipe(
            map(expand => {
              const properties = entries.map(([key, defaultValue]) =>
                toConfigurationProperty(key, defaultValue)
              );
              const flattened = keyBy(properties, ({ key }) => key);
              const unflattened = unflatten(flattened);
              return toTreeNodes(unflattened, expand);
            })
          )
        )
      );

      this.localizations$ = toPropertiesProvider(
        this.localizationControlsFormGroup as FormGroup,
        this.formGroup.controls.localizations as FormGroup,
        localizationDefaults
      ).pipe(
        takeUntil(this.destroyed$),
        map(entries =>
          entries.map(([key, defaultValue]) => toProperty(key, defaultValue))
        )
      );
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
  onKeyInput(key: string): void {
    setDefaultDatabaseNameAndUsername(
      this.formGroup.controls.configurations as FormGroup,
      key
    );
  }
}
