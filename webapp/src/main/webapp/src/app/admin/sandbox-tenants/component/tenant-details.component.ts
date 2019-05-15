import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { MenuItem } from 'primeng/api';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { flattenJsonObject } from '../../../shared/support/support';
import { TranslateService } from '@ngx-translate/core';
import { TenantConfiguration } from '../model/tenant-configuration';
import { TenantService } from '../service/tenant.service';
import { CustomValidators } from '../../../shared/validator/custom-validators';

@Component({
  selector: 'tenant-details-config',
  templateUrl: './tenant-details.component.html'
})
export class TenantConfigurationDetailsComponent implements OnInit {
  @Input()
  tenant: TenantConfiguration;
  @Output()
  deleteClicked: EventEmitter<TenantConfiguration> = new EventEmitter();

  expanded = false;
  editMode = false;
  configurationProperties: ConfigurationProperty[] = [];
  localizationOverrides: ConfigurationProperty[] = [];
  menuItems: MenuItem[];
  tenantForm: FormGroup;
  tempForm: FormGroup;

  constructor(
    private translationLoader: RdwTranslateLoader,
    private translateService: TranslateService,
    private service: TenantService,
    private formBuilder: FormBuilder,
    private settingsService: ApplicationSettingsService
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.formBuilder.group({
      label: [this.tenant.label, CustomValidators.notBlank],
      description: [this.tenant.description],
      configurationProperties: this.formBuilder.array([]),
      localizationOverrides: this.formBuilder.array([])
    });
    this.mapLocalizationOverrides();
    this.mapConfigurationProperties();
    this.configureMenuItems();
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      //TODO: Get the correct language code from somewhere, do not hardcode
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        for (let key in translations) {
          let locationOverrideFormArray = <FormArray>(
            this.tenantForm.controls['localizationOverrides']
          );
          if (translations.hasOwnProperty(key)) {
            const value = translations[key];
            const localizationOverrides =
              this.tenant.localizationOverrides || [];
            const override = localizationOverrides.find(
              override => override.key === key
            );
            if (override) {
              this.localizationOverrides.push(
                new ConfigurationProperty(
                  key,
                  override.value,
                  override.originalValue
                )
              );
              locationOverrideFormArray.controls.push(
                new FormControl(override.value)
              );
            } else {
              this.localizationOverrides.push(
                new ConfigurationProperty(key, value)
              );
              locationOverrideFormArray.controls.push(new FormControl(value));
            }
          }
        }
      });
  }

  private mapConfigurationProperties() {
    this.settingsService.getSettings().subscribe(configProperties => {
      const configPropertiesFormArray = <FormArray>(
        this.tenantForm.controls['configurationProperties']
      );
      let flattenedConfigProperties = flattenJsonObject(configProperties);
      Object.keys(flattenedConfigProperties).forEach(key => {
        const propertyOverrides = this.tenant.configurationProperties || [];
        const override = propertyOverrides.find(
          property => property.key === key
        );
        if (override) {
          this.configurationProperties.push(
            new ConfigurationProperty(
              key,
              override.value,
              override.originalValue
            )
          );
          configPropertiesFormArray.controls.push(
            new FormControl(override.value)
          );
        } else {
          const val = flattenedConfigProperties[key] || '';
          this.configurationProperties.push(
            new ConfigurationProperty(key, val)
          );
          configPropertiesFormArray.push(new FormControl(val));
        }
      });
    });
  }

  editClicked(): void {
    this.tempForm = cloneDeep(this.tenantForm);
    this.editMode = true;
  }

  cancelClicked(): void {
    this.tenantForm = cloneDeep(this.tempForm);
    this.editMode = false;
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const modifiedConfigurationProperties = this.configurationProperties.filter(
      property => property.originalValue !== property.value
    );
    let updatedTenant = {
      code: this.tenant.code,
      ...this.tenantForm.value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: modifiedConfigurationProperties
    };
    this.service.update(updatedTenant);
    this.editMode = false;
  }

  private configureMenuItems(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('sandbox-config.actions.delete'),
        icon: 'fa fa-close',
        command: () => this.deleteClicked.emit(this.tenant)
      }
    ];
  }
}
