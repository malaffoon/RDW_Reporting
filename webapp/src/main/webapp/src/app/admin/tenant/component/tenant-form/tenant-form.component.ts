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
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { showErrors } from '../../../../shared/form/forms';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { configurationsFormGroup } from '../property-override-tree-table/property-override-tree-table.component';
import { localizationsFormGroup } from '../property-override-table/property-override-table.component';
import {
  isBlank,
  rightDifference,
  valued
} from '../../../../shared/support/support';
import { ConfigurationProperty, Property } from '../../model/property';
import { toConfigurationProperty, toProperty } from '../../model/properties';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { TreeNode } from 'primeng/api';

const keyboardDebounceInMilliseconds = 300;

export type FormMode = 'create' | 'update';

export const tenantKey = Validators.pattern(/^\w+$/);

export function available(
  isAvailable: (value: string) => Observable<boolean>
): AsyncValidatorFn {
  return function(
    control: AbstractControl
  ): Observable<{ unavailable: boolean } | null> {
    return isAvailable(control.value).pipe(
      map(available => (available ? null : { unavailable: true }))
    );
  };
}

export function tenantFormGroup(
  value: TenantConfiguration,
  configurationDefaults: any,
  localizationDefaults: any,
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

  // TODO bind change to update default passwords here?

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
            [available(this.tenantKeyAvailable)]
          ),
          id: new FormControl(value.id || '', [Validators.required]),
          label,
          description,
          configurations,
          localizations
        }
  );
}

const passwordKeyExpression = /^(\w+)\.password$/;

function onePasswordPerUser(
  formGroup: FormGroup
): { onePasswordPerUser: boolean; usernames: string[] } | null {
  const controlNames = Object.keys(formGroup.controls);

  const passwordKeys = controlNames.filter(controlName =>
    passwordKeyExpression.test(controlName)
  );

  const passwordsByUsername: {
    [username: string]: string[];
  } = passwordKeys.reduce((byUsername, passwordKey) => {
    // assumes username of same base path for every password
    const usernameKey = `${
      passwordKeyExpression.exec(passwordKey)[1]
    }.username`;
    // this is being run on every form control addition so we need to defensively set this
    // TODO disconnected from the values because the formgroup has changed.... -NEED control value accessor....
    const username = (formGroup.get(usernameKey) || <any>{}).value;
    const password = (formGroup.get(passwordKey) || <any>{}).value;
    const passwords = byUsername[username];
    if (passwords != null) {
      if (!passwords.includes(password)) {
        passwords.push(password);
      }
    } else {
      byUsername[username] = [password];
    }
    return byUsername;
  }, {});

  const usernames = Object.entries(passwordsByUsername)
    .filter(([, passwords]) => passwords.length > 1)
    .map(([username]) => username);

  return usernames.length > 0 ? { onePasswordPerUser: true, usernames } : null;
}

function toPropertiesProvider<T = any>(
  searchFormGroup: FormGroup,
  formGroup: FormGroup,
  defaults: { [key: string]: T }
): Observable<[string, T][]> {
  return combineLatest(
    ...Object.entries(searchFormGroup.controls).map(([key, control]) => {
      const startValue = searchFormGroup.value[key];
      switch (key) {
        case 'search':
          return control.valueChanges.pipe(
            startWith(startValue),
            debounceTime(keyboardDebounceInMilliseconds)
          );
        case 'required':
        case 'modified':
          return control.valueChanges.pipe(startWith(startValue));
      }
      throw new Error('unknown search field');
    })
  ).pipe(
    map(([search, modified]) =>
      Object.entries(defaults)
        .filter(([key, defaultValue]) => {
          const caseInsensitiveSearch = search.toLowerCase();
          const value = formGroup.controls[key].value;
          return (
            (isBlank(search) ||
              (key.toLowerCase().includes(caseInsensitiveSearch) ||
                (typeof value === 'string' &&
                  value.toLowerCase().includes(caseInsensitiveSearch)))) &&
            (!modified || value !== defaultValue)
          );
        })
        .sort(ordering(byString).on(([key]) => key).compare)
    )
  );
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

  // internals
  configurations$: Observable<TreeNode[]>;
  localizations$: Observable<Property[]>;

  configurationControlsFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    required: new FormControl(false),
    modified: new FormControl(false)
  });

  localizationControlsFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    modified: new FormControl(false)
  });

  // computed values
  readonlyGroups: string[] = [];
  formGroup: FormGroup;
  destroyed$: Subject<void> = new Subject();

  onSaveButtonClick(): void {
    const {
      value: { type },
      formGroup: {
        value: {
          id,
          key: code,
          label,
          description,
          tenant,
          dataSet,
          configurations,
          localizations
        }
      }
    } = this;

    const emitter = this.mode === 'create' ? this.create : this.update;
    const updated: TenantConfiguration = {
      type,
      code,
      id,
      label,
      description,
      parentTenantCode: (tenant || <any>{}).code,
      dataSet,
      configurations: valued(
        rightDifference(this.configurationDefaults, configurations)
      ),
      localizations: valued(
        rightDifference(this.localizationDefaults, localizations)
      )
    };

    console.log(updated);

    emitter.emit(updated);
  }

  // TODO currently this causes mulitple rerenders and i am not able to present a loading spinner
  // i think this needs to be reworked such that the @Input()s each have their own subject to push to
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
        tenants,
        dataSets
      );

      // set the defaults on the formGroup
      this.localizationControlsFormGroup.patchValue({
        required: this.requiredConfiguration
      });

      this.configurations$ = toPropertiesProvider(
        this.configurationControlsFormGroup as FormGroup,
        this.formGroup.controls.configurations as FormGroup,
        configurationDefaults
      );

      this.localizations$ = toPropertiesProvider(
        this.localizationControlsFormGroup as FormGroup,
        this.formGroup.controls.localizations as FormGroup,
        localizationDefaults
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onTenantChange(tenant: TenantConfiguration): void {
    // reset form values to tenant overrides
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

  onKeyChange(code: string): void {
    // apply default passwords for sandboxes based on key
    if (this.value.type !== 'TENANT') {
      return;
    }

    // TODO apply default usernames
    // const key = (code || '').toLowerCase();
    // const defaultDataBaseName = `reporting_${key}`;
    // const defaultUsername = key;
    // const { configurationOverrides: { datasources = [] } = {} } = this;
    //
    // Object.keys(datasources).forEach(dataSourceKey => {
    //   const dataSource = datasources[dataSourceKey];
    //   const urlPartsDatabase: ConfigurationProperty = dataSource.find(
    //     property => property.key === 'urlParts.database'
    //   );
    //   if (!urlPartsDatabase.modified) {
    //     urlPartsDatabase.value = defaultDataBaseName;
    //   }
    //   const username = <ConfigurationProperty>(
    //     dataSource.find(property => property.key === 'username')
    //   );
    //   if (!username.modified) {
    //     username.value = defaultUsername;
    //   }
    // });
  }
}
