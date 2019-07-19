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
import {
  DataSet,
  SandboxConfiguration
} from '../../model/sandbox-configuration';
import {
  getModifiedConfigProperties,
  mapConfigurationProperties
} from '../../mapper/tenant.mapper';
import { showErrors } from '../../../../shared/form/forms';
import { cloneDeep, forOwn } from 'lodash';

export type FormMode = 'create' | 'update';

export const tenantKey = Validators.pattern(
  /^[a-zA-Z0-9][\w\-]*?[a-zA-Z0-9]?$/
);

/**
 * Has side effects on tenant.localizationOverrides and formGroup
 */
function mapLocalizationOverrides(
  tenant: SandboxConfiguration,
  formGroup: FormGroup,
  defaults: any,
  overrides: ConfigurationProperty[]
): void {
  const { localizationOverrides = [] } = tenant;
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

/*

  checkPasswordsAndUsernames(property: ConfigurationProperty) {
    if (
      property.formControlName.indexOf('.password') !== -1 ||
      property.formControlName.indexOf('.username')
    ) {
      this.passwordMismatch = this.anyPasswordsNotMatchignUsernames(
        this.configurationProperties.datasources
      );
    }
  }

  private anyPasswordsNotMatchignUsernames(datasources: any) {
    const users = [];

    forOwn(datasources, dataSource => {
      users.push({
        username: dataSource.find(x => x.key === 'username').value,
        password: dataSource.find(x => x.key === 'password').value
      });
    });

    const uniqueUsernamesAndPasswords = Array.from(
      new Set(users.map(x => x.username + x.password))
    );
    const uniqueUsernames = Array.from(new Set(users.map(x => x.username)));

    return uniqueUsernames.length !== uniqueUsernamesAndPasswords.length;
  }

 */

@Component({
  selector: 'tenant-sandbox',
  templateUrl: './tenant-sandbox.component.html',
  styleUrls: ['./tenant-sandbox.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantSandboxComponent implements OnChanges {
  readonly showErrors = showErrors;

  @Input()
  mode: FormMode;

  @Input()
  value: SandboxConfiguration;

  @Input()
  tenants: SandboxConfiguration[] = [];

  @Input()
  dataSets: DataSet[] = [];

  @Input()
  configurationDefaults: any;

  @Input()
  localizationDefaults: any;

  @Input()
  writable: boolean;

  @Output()
  save: EventEmitter<SandboxConfiguration> = new EventEmitter();

  @Output()
  delete: EventEmitter<SandboxConfiguration> = new EventEmitter();

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

  readonly readonlyGroups = ['datasources', 'archive'];

  constructor(private formBuilder: FormBuilder) {}

  onSaveButtonClick(): void {
    const {
      formGroup,
      localizationOverrides,
      value: { code, dataSet, configurationProperties }
    } = this;

    this.save.emit({
      code,
      dataSet,
      ...formGroup.value,
      localizationOverrides: localizationOverrides.filter(
        override => override.originalValue !== override.value
      ),
      configurationProperties: getModifiedConfigProperties(
        configurationProperties
      )
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // only initialize when all dependencies are received
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
              dataset: [
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
          : this.formBuilder.group({
              key: [
                value.code || '',
                [Validators.required, tenantKey, Validators.maxLength(20)]
              ],
              id: [value.id || '', [Validators.required, tenantKey]],
              label: [value.label || '', [notBlank]],
              description: [value.description || ''],
              configurationProperties: this.formBuilder.group({}),
              localizationOverrides: this.formBuilder.group({})
            });

      this.configurationOverrides = cloneDeep(
        this.value.configurationProperties
      );

      mapLocalizationOverrides(
        this.value,
        this.formGroup,
        this.localizationDefaults,
        this.localizationOverrides
      );
    }
  }

  private onTenantChange(tenant: SandboxConfiguration): void {
    if (tenant.configurationProperties) {
      this.configurationOverrides = mapConfigurationProperties(
        this.configurationDefaults,
        tenant.configurationProperties
      );
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
