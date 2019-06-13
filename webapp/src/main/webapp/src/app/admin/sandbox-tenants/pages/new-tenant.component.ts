import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '../service/tenant.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { ConfigurationProperty } from '../model/configuration-property';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { mapConfigurationProperties } from '../mapper/tenant.mapper';
import { NotificationService } from '../../../shared/notification/notification.service';
import { TenantStore } from '../store/tenant.store';
import { generateRandomPassword } from '../../../shared/support/support';

@Component({
  selector: 'new-tenant',
  templateUrl: './new-tenant.component.html'
})
export class NewTenantConfigurationComponent implements OnInit, AfterViewInit {
  @ViewChild('tenantKeyInput')
  tenantKeyInput: ElementRef;

  tenantForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: ConfigurationProperty[] = [];
  // Contains the full list of configuration properties, with default values
  configurationProperties: any;

  constructor(
    private service: TenantService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router,
    private store: TenantStore,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.formBuilder.group({
      key: [
        null,
        [
          Validators.required,
          CustomValidators.tenantKey,
          Validators.maxLength(20)
        ]
      ],
      id: [null, [Validators.required, CustomValidators.tenantKey]],
      label: [null, CustomValidators.notBlank],
      description: [null],
      configurationProperties: this.formBuilder.group({}),
      localizationOverrides: this.formBuilder.group({})
    });

    this.mapLocalizationOverrides();

    this.service
      .getDefaultConfigurationProperties()
      .subscribe(configProperties => {
        this.configurationProperties = mapConfigurationProperties(
          configProperties
        );
        this.setDefaultPasswords();
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.tenantKeyInput.nativeElement.focus());
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const newTenant = {
      ...this.tenantForm.value,
      code: this.tenantForm.get('key').value.toUpperCase(),
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.configurationProperties
    };
    this.service.create(newTenant).subscribe(
      createdTenant => {
        this.store.setState([createdTenant, ...this.store.state]);
        this.router.navigate(['tenants']);
      },
      error =>
        this.notificationService.error({ id: 'tenant-config.errors.create' })
    );
  }

  updateConfigProperties() {
    const updatedProperties = { ...this.configurationProperties };
    const key = this.tenantForm.get('key').value.toUpperCase();
    const defaultDataBaseName = `reporting_${key}`;
    const archivePathPrefixProperty = <ConfigurationProperty>(
      updatedProperties.archive.find(property => property.key === 'pathPrefix')
    );
    archivePathPrefixProperty.value = key;
    archivePathPrefixProperty.originalValue = key;

    Object.keys(this.configurationProperties.datasources).forEach(
      dataSourceKey => {
        const dbProperty = <ConfigurationProperty>(
          updatedProperties.datasources[dataSourceKey].find(
            property => property.key === 'urlParts.database'
          )
        );
        dbProperty.value = defaultDataBaseName;
        dbProperty.originalValue = defaultDataBaseName;
      }
    );

    this.configurationProperties = updatedProperties;
  }

  setDefaultPasswords(): void {
    const updatedProperties = { ...this.configurationProperties };
    const randomDefaultPassword = generateRandomPassword();
    Object.keys(this.configurationProperties.datasources).forEach(
      dataSourceKey => {
        const dbProperty = <ConfigurationProperty>(
          updatedProperties.datasources[dataSourceKey].find(
            property => property.key === 'password'
          )
        );
        dbProperty.value = randomDefaultPassword;
        dbProperty.originalValue = randomDefaultPassword;
      }
    );
    this.configurationProperties = updatedProperties;
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        const locationOverrideFormGroup = <FormGroup>(
          this.tenantForm.controls['localizationOverrides']
        );
        for (const key in translations) {
          // check also if property is not inherited from prototype
          if (translations.hasOwnProperty(key)) {
            const value = translations[key];
            this.localizationOverrides = [
              ...this.localizationOverrides,
              new ConfigurationProperty(key, value)
            ];
            locationOverrideFormGroup.controls[key] = new FormControl(value);
          }
        }
      });
  }
}
