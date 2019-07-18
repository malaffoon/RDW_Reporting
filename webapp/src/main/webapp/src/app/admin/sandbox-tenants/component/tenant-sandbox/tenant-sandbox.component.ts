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
import { TenantConfiguration } from '../../model/tenant-configuration';

export type FormMode = 'create' | 'update';

export const tenantKey = Validators.pattern(
  /^[a-zA-Z0-9][\w\-]*?[a-zA-Z0-9]?$/
);

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
    /*
      Both `sandbox` and `localizationDefaults` are provided by the parent component and fetched with asynchronous
      service calls, so he we need to ensure that the sandbox and defaults have been defined, and that the form is
      initialized.
     */
    if (
      this.value != null &&
      this.localizationDefaults != null &&
      this.mode != null &&
      (!this.value.sandbox || (this.tenants != null && this.dataSets != null))
    ) {
      this.formGroup = this.value.sandbox
        ? this.formBuilder.group({
            label: [this.value.label || '', [notBlank]],
            description: [this.value.description || ''],
            dataset: [
              this.dataSets.find(
                ({ id }) => id === (this.value.dataSet || <DataSet>{}).id
              ),
              [Validators.required]
            ],
            tenant: [
              this.tenants.find(
                ({ code }) => code === this.value.parentTenantCode
              ),
              [Validators.required]
            ],
            configurationProperties: this.formBuilder.group({}),
            localizationOverrides: this.formBuilder.group({})
          })
        : this.formBuilder.group({
            key: [
              this.value.code || '',
              [Validators.required, tenantKey, Validators.maxLength(20)]
            ],
            id: [this.value.id || '', [Validators.required, tenantKey]],
            label: [this.value.label || '', [notBlank]],
            description: [this.value.description || ''],
            configurationProperties: this.formBuilder.group({}),
            localizationOverrides: this.formBuilder.group({})
          });

      this.mapLocalizationOverrides(
        this.value,
        this.formGroup,
        this.localizationDefaults,
        this.localizationOverrides
      );
    }
  }

  /**
   * Has side effects on localizationOverrides and formGroup
   */
  private mapLocalizationOverrides(
    tenant: SandboxConfiguration,
    formGroup: FormGroup,
    defaults: any,
    overrides: ConfigurationProperty[]
  ): void {
    const { localizationOverrides = [] } = tenant;
    for (const key in defaults) {
      const overrideFormGroup = <FormGroup>(
        formGroup.controls.localizationOverrides
      );
      if (defaults.hasOwnProperty(key)) {
        const defaultValue = defaults[key];

        const override = localizationOverrides.find(o => o.key === key);
        if (override) {
          overrides.push(
            new ConfigurationProperty(
              key,
              override.value,
              undefined,
              defaultValue
            )
          );
          overrideFormGroup.controls[key] = new FormControl(override.value);
        } else {
          overrides.push(new ConfigurationProperty(key, defaultValue));
          overrideFormGroup.controls[key] = new FormControl(defaultValue);
        }
      }
    }
  }

  private onTenantChange(tenant: TenantConfiguration) {
    // this is changing the defaults i think - i dont think we want this - we just want to change the actuals

    this.configurationProperties = mapConfigurationProperties(
      this.configurationDefaults,
      tenant.configurationProperties
    );

    if (tenant.localizationOverrides) {
      this.mapLocalizationOverrides(
        this.value,
        this.formGroup,
        this.localizationDefaults,
        tenant.localizationOverrides
      );
    }
  }

  onKeyChange(code: string): void {
    const key = (code || '').toLowerCase();
    const defaultDataBaseName = `reporting_${key}`;
    const defaultUsername = key;

    // if (this.configurationProperties) {
    //   Object.keys(this.configurationProperties.datasources).forEach(
    //     dataSourceKey => {
    //       const dataSource = this.configurationProperties.datasources[
    //         dataSourceKey
    //         ];
    //       const urlPartsDatabase = <ConfigurationProperty>(
    //         dataSource.find(property => property.key === 'urlParts.database')
    //       );
    //       if (!urlPartsDatabase.modified) {
    //         urlPartsDatabase.value = defaultDataBaseName;
    //       }
    //       const username = <ConfigurationProperty>(
    //         dataSource.find(property => property.key === 'username')
    //       );
    //       if (!username.modified) {
    //         username.value = defaultUsername;
    //       }
    //     }
    //   );
    // }
  }

  // private mapLocalizationOverrides() {
  //   this.localizationDefaults.forEach(translations => {
  //     const locationOverrideFormGroup = <FormGroup>(
  //       this.formGroup.controls.localizationOverrides
  //     );
  //     for (const key in translations) {
  //       // check also if property is not inherited from prototype
  //       if (translations.hasOwnProperty(key)) {
  //         const value = translations[key];
  //         this.localizationOverrides = [
  //           ...this.localizationOverrides,
  //           new ConfigurationProperty(key, value)
  //         ];
  //         locationOverrideFormGroup.controls[key] = new FormControl(value);
  //       }
  //     }
  //   });
  // }
}
