import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  notBlank,
  tenantKey
} from '../../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../../model/configuration-property';
import {
  DataSet,
  SandboxConfiguration
} from '../../model/sandbox-configuration';
import { getModifiedConfigProperties } from '../../mapper/tenant.mapper';

export type FormMode = 'create' | 'update';

@Component({
  selector: 'tenant-sandbox',
  templateUrl: './tenant-sandbox.component.html',
  styleUrls: ['./tenant-sandbox.component.less']
})
export class TenantSandboxComponent implements OnChanges {
  @Input()
  mode: FormMode;

  @Input()
  value: SandboxConfiguration;

  @Input()
  tenants: SandboxConfiguration[] = [];

  @Input()
  dataSets: DataSet[] = [];

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
    localizationDefaults: any,
    localizationOverrides: ConfigurationProperty[]
  ): void {
    for (const key in localizationDefaults) {
      const locationOverrideFormGroup = <FormGroup>(
        formGroup.controls.localizationOverrides
      );
      if (localizationDefaults.hasOwnProperty(key)) {
        const value = localizationDefaults[key];
        const localizationOverrides = tenant.localizationOverrides || [];
        const override = localizationOverrides.find(o => o.key === key);
        if (override) {
          localizationOverrides.push(
            new ConfigurationProperty(key, override.value, undefined, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(
            override.value
          );
        } else {
          localizationOverrides.push(new ConfigurationProperty(key, value));
          locationOverrideFormGroup.controls[key] = new FormControl(value);
        }
      }
    }
  }
}
