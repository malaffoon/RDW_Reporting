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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { notBlank } from '../../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../../model/configuration-property';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { showErrors } from '../../../../shared/form/forms';
import { cloneDeep, forOwn } from 'lodash';
import { getModifiedConfigProperties } from '../../mapper/tenant.mapper';

export type FormMode = 'create' | 'update';

export const tenantKey = Validators.pattern(/^\w+$/);

/**
 * Has side effects on tenant.localizationOverrides and formGroup
 */
function mapLocalizationOverrides(
  tenant: TenantConfiguration,
  formGroup: FormGroup,
  defaults: any,
  overrides: ConfigurationProperty[]
): void {
  const localizationOverrides = tenant.localizationOverrides || [];
  const overrideFormGroup: FormGroup = formGroup.controls
    .localizationOverrides as FormGroup;

  // why is this impl different for each tenant type? also - it doesn't seem to work...
  // if (tenant.type === 'TENANT') {
  //   defaults.forEach(translations => {
  //     const overrideFormGroup = <FormGroup>(
  //       this.formGroup.controls.localizationOverrides
  //     );
  //     for (const key in translations) {
  //       // check also if property is not inherited from prototype
  //       if (translations.hasOwnProperty(key)) {
  //         const value = translations[key];
  //         overrides.push(new ConfigurationProperty(key, value));
  //         overrideFormGroup.controls[key] = new FormControl(value);
  //       }
  //     }
  //   });
  // } else {

  forOwn(defaults, (value, key) => {
    const defaultValue = defaults[key];
    const override = localizationOverrides.find(o => o.key === key);
    if (override) {
      overrides.push(
        new ConfigurationProperty(key, override.value, undefined, defaultValue)
      );
      overrideFormGroup.controls[key] = new FormControl(override.value);
    } else {
      overrides.push(new ConfigurationProperty(key, defaultValue));
      overrideFormGroup.controls[key] = new FormControl(defaultValue);
    }
  });
  // }
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
  mode: FormMode;

  @Input()
  value: TenantConfiguration;

  @Input()
  tenants: TenantConfiguration[] = [];

  @Input()
  dataSets: DataSet[] = [];

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
  configurationOverrides: any = {};
  localizationOverrides: ConfigurationProperty[] = [];

  formGroup: FormGroup;

  readonlyGroups: string[] = [];

  constructor(private formBuilder: FormBuilder) {}

  onSaveButtonClick(): void {
    const {
      formGroup: {
        value: { id, key: code, label, description, tenant, dataSet }
      },
      // TODO these should come from the form too...
      configurationOverrides,
      localizationOverrides,
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
      localizationOverrides: localizationOverrides.filter(
        override => override.originalValue !== override.value
      ),
      configurationProperties: getModifiedConfigProperties(
        configurationOverrides
      )
    });
  }

  // TODO currently this causes mulitple rerenders and i am not able to present a loading spinner
  // i think this needs to be reworked such that the @Input()s each have their own subject to push to
  ngOnChanges(changes: SimpleChanges): void {
    const { value, localizationDefaults, mode, tenants, dataSets } = this;

    if (
      value != null &&
      localizationDefaults != null &&
      mode != null &&
      (value.type !== 'SANDBOX' || (tenants != null && dataSets != null))
    ) {
      // setup sandbox/tenant specific form
      this.formGroup =
        value.type === 'SANDBOX'
          ? this.formBuilder.group({
              label: [value.label || '', [notBlank]],
              description: [value.description || ''],
              dataSet: [
                dataSets.find(
                  ({ id }) => id === (value.dataSet || <DataSet>{}).id
                ),
                [Validators.required]
              ],
              tenant: [
                tenants.find(({ code }) => code === value.parentTenantCode),
                [Validators.required]
              ],
              configurationProperties: this.formBuilder.group({}),
              localizationOverrides: this.formBuilder.group({})
            })
          : this.formBuilder.group(
              {
                key: [
                  value.code || '',
                  [Validators.required, tenantKey, Validators.maxLength(20)]
                ],
                id: [value.id || '', [Validators.required]],
                label: [value.label || '', [notBlank]],
                description: [value.description || ''],
                configurationProperties: this.formBuilder.group({}),
                localizationOverrides: this.formBuilder.group({})
              },
              {
                validators: [onePasswordPerUser]
              }
            );

      // this.configurationOverrides = mapConfigurationProperties(
      //   this.configurationDefaults,
      //   this.value.configurationProperties
      // );

      this.configurationOverrides = this.configurationOverrides = cloneDeep(
        this.value.configurationProperties
      );

      mapLocalizationOverrides(
        this.value,
        this.formGroup,
        this.localizationDefaults,
        this.localizationOverrides
      );

      this.readonlyGroups =
        this.mode === 'create' ? [] : ['datasources', 'archive'];
    }
  }

  private onTenantChange(tenant: TenantConfiguration): void {
    if (tenant.configurationProperties) {
      // this.configurationOverrides = mapConfigurationProperties(
      //   this.configurationDefaults,
      //   tenant.configurationProperties
      // );
      // this will erase existing overrides...
      this.configurationOverrides = cloneDeep(tenant.configurationProperties);
    }
    if (tenant.localizationOverrides) {
      mapLocalizationOverrides(
        this.value,
        this.formGroup,
        this.localizationDefaults,
        this.localizationOverrides
      );
    }
  }

  onKeyChange(code: string): void {
    const key = (code || '').toLowerCase();
    const defaultDataBaseName = `reporting_${key}`;
    const defaultUsername = key;
    const { configurationOverrides: { datasources = [] } = {} } = this;

    Object.keys(datasources).forEach(dataSourceKey => {
      const dataSource = datasources[dataSourceKey];
      const urlPartsDatabase: ConfigurationProperty = dataSource.find(
        property => property.key === 'urlParts.database'
      );
      if (!urlPartsDatabase.modified) {
        urlPartsDatabase.value = defaultDataBaseName;
      }
      const username = <ConfigurationProperty>(
        dataSource.find(property => property.key === 'username')
      );
      if (!username.modified) {
        username.value = defaultUsername;
      }
    });
  }
}
