import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { notBlank } from '../../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../../model/configuration-property';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { Forms, showErrors } from '../../../../shared/form/forms';
import { cloneDeep, forOwn } from 'lodash';
import { getModifiedConfigProperties } from '../../model/tenants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { configurationsFormGroup } from '../property-override-tree-table/property-override-tree-table.component';
import { localizationOverridesFormGroup } from '../property-override-table/property-override-table.component';
import { rightDifference } from '../../../../shared/support/support';

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
    value.configurationProperties
  );

  const localizations = localizationOverridesFormGroup(
    localizationDefaults,
    value.localizationOverrides
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
        },
    {
      validators: [onePasswordPerUser]
    }
  );
}

const passwordKeyExpression = /^(\w+)\.password$/;

function onePasswordPerUser(
  formGroup: FormGroup
): { onePasswordPerUser: boolean; usernames: string[] } | null {
  const configurationProperties: FormGroup = formGroup.controls
    .configurationProperties as FormGroup;

  const controlNames = Object.keys(configurationProperties.controls);

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
    const username = (configurationProperties.get(usernameKey) || <any>{})
      .value;
    const password = (configurationProperties.get(passwordKey) || <any>{})
      .value;
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

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantFormComponent implements OnChanges {
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
  requiredConfiguration: boolean = false;

  // we make a copy of these for some reason instead of using the props on the tenant model - not sure why
  // seems like we are maybe not using the view-model pattern here
  // configurationOverrides: any = {};
  // localizationOverrides: ConfigurationProperty[] = [];

  formGroup: FormGroup;

  readonlyGroups: string[] = [];

  constructor(private formBuilder: FormBuilder) {}

  onSaveButtonClick(): void {
    const {
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
      },
      // TODO these should come from the form too...
      // configurationOverrides,
      // localizationOverrides,
      value: { type }
    } = this;

    const emitter = this.mode === 'create' ? this.create : this.update;

    emitter.emit({
      type,
      code,
      id,
      label,
      description,
      parentTenantCode: (tenant || {}).code,
      dataSet,
      // TODO only send diff
      configurationProperties: rightDifference(
        this.configurationDefaults,
        localizations
      ).middle,
      localizationOverrides: rightDifference(
        this.localizationDefaults,
        configurations
      ).middle
    });
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
      tenantKeyAvailable
    } = this;

    if (
      value != null &&
      mode != null &&
      configurationDefaults != null &&
      localizationDefaults != null &&
      tenantKeyAvailable != null &&
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
    }
  }

  private onTenantChange(tenant: TenantConfiguration): void {
    // if (tenant.configurationProperties) {
    //   this.configurationOverrides = cloneDeep(tenant.configurationProperties);
    // }
    // if (tenant.localizationOverrides) {
    //   mapLocalizationOverrides(
    //     this.value,
    //     this.formGroup,
    //     this.localizationDefaults,
    //     this.localizationOverrides
    //   );
    // }

    // reset form values to tenant overrides
    this.formGroup.patchValue({
      configurations: configurationsFormGroup(
        this.configurationDefaults,
        this.value.configurationProperties
      ),
      localizations: localizationOverridesFormGroup(
        this.localizationDefaults,
        this.value.localizationOverrides
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
