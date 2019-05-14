import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '../service/tenant.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { ConfigurationProperty } from '../model/configuration-property';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { flattenJsonObject } from '../../../shared/support/support';
import { CustomValidators } from '../../../shared/validator/custom-validators';

@Component({
  selector: 'new-tenant',
  templateUrl: './new-tenant.component.html'
})
export class NewTenantConfigurationComponent {
  tenantForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: ConfigurationProperty[] = [];
  // Contains the full list of configuration properties, with default values
  configurationProperties: ConfigurationProperty[] = [];

  constructor(
    private service: TenantService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router,
    private settingsService: ApplicationSettingsService
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.formBuilder.group({
      label: [null, CustomValidators.notBlank],
      description: [null],
      configurationProperties: this.formBuilder.array([]),
      localizationOverrides: this.formBuilder.array([])
    });

    this.mapLocalizationOverrides();

    this.settingsService.getSettings().subscribe(configProperties => {
      const configPropertiesFormArray = <FormArray>(
        this.tenantForm.controls['configurationProperties']
      );
      let flattenedConfigProperties = flattenJsonObject(configProperties);
      Object.keys(flattenedConfigProperties).forEach(key => {
        const val = flattenedConfigProperties[key] || '';
        this.configurationProperties.push(new ConfigurationProperty(key, val));
        configPropertiesFormArray.push(new FormControl(val));
      });
    });
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      // TODO: Use the proper configured language code, do not hardcode english
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        let locationOverrideFormArray = <FormArray>(
          this.tenantForm.controls['localizationOverrides']
        );
        for (let key in translations) {
          // check also if property is not inherited from prototype
          if (translations.hasOwnProperty(key)) {
            let value = translations[key];
            this.localizationOverrides.push(
              new ConfigurationProperty(key, value)
            );
            locationOverrideFormArray.controls.push(new FormControl(value));
          }
        }
      });
  }

  onSubmit(): void {
    //TODO: This key should be generated in the database. Remove this once the backend is in place
    const randomCode = Math.floor(Math.random() * 9999999) + 1000000;
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const modifiedConfigurationProperties = this.configurationProperties.filter(
      property => property.originalValue !== property.value
    );
    const newTenant = {
      ...this.tenantForm.value,
      code: randomCode,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: modifiedConfigurationProperties
    };
    this.service.create(newTenant);
    this.router.navigate(['tenants']);
  }

  updateOverride(override: ConfigurationProperty, index: number): void {
    const overrides = <FormArray>(
      this.tenantForm.controls['localizationOverrides']
    );
    const newVal = overrides.controls[index].value;

    if (this.localizationOverrides.indexOf(override) > -1) {
      let existingOverride = this.localizationOverrides[
        this.localizationOverrides.indexOf(override)
      ];
      existingOverride.value = newVal;
    } else {
      override.value = newVal;
      this.localizationOverrides.push(override);
    }
  }

  updateConfigurationProperty(
    property: ConfigurationProperty,
    index: number
  ): void {
    const properties = <FormArray>(
      this.tenantForm.controls['configurationProperties']
    );
    const newVal = properties.controls[index].value;

    let existingProperty = this.configurationProperties[
      this.configurationProperties.indexOf(property)
    ];
    existingProperty.value = newVal;
  }
}
