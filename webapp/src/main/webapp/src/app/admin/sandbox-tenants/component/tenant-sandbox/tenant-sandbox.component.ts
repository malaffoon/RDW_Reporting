import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../../model/configuration-property';
import { SandboxConfiguration } from '../../model/sandbox-configuration';
import { getModifiedConfigProperties } from '../../mapper/tenant.mapper';

@Component({
  selector: 'tenant-sandbox',
  templateUrl: './tenant-sandbox.component.html',
  styleUrls: ['./tenant-sandbox.component.less']
})
export class TenantSandboxComponent implements OnInit, OnChanges {
  @Input()
  value: SandboxConfiguration;

  @Input()
  localizationDefaults: any;

  @Input()
  writable: boolean;

  @Output()
  save: EventEmitter<SandboxConfiguration> = new EventEmitter();

  @Output()
  delete: EventEmitter<SandboxConfiguration> = new EventEmitter();

  // formGroupOriginalValues: any;
  formGroup: FormGroup = new FormGroup({
    label: new FormControl('', [CustomValidators.notBlank]),
    description: new FormControl(''),
    configurationProperties: new FormGroup({}),
    localizationOverrides: new FormGroup({})
  });
  configurationProperties: any;
  localizationOverrides: ConfigurationProperty[] = [];

  readonly readonlyGroups = ['datasources', 'archive'];

  constructor() {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      label: this.value.label,
      description: this.value.description
    });
  }

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
    if (this.value != null && this.localizationDefaults != null) {
      // Make sure a form has been initialized before mapping and processing overrides
      this.formGroup.patchValue({
        label: this.value.label,
        description: this.value.description
      });
      this.mapLocalizationOverrides(this.localizationDefaults);
    }
  }

  private mapLocalizationOverrides(localizationDefaults: any): void {
    for (let key in localizationDefaults) {
      const locationOverrideFormGroup = <FormGroup>(
        this.formGroup.controls.localizationOverrides
      );
      if (localizationDefaults.hasOwnProperty(key)) {
        const value = localizationDefaults[key];
        const localizationOverrides = this.value.localizationOverrides || [];
        const override = localizationOverrides.find(o => o.key === key);
        if (override) {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, override.value, undefined, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(
            override.value
          );
        } else {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(value);
        }
      }
    }
  }
}
