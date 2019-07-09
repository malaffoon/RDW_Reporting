import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { NotificationService } from '../../../shared/notification/notification.service';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../model/configuration-property';
import { TenantConfiguration } from '../model/tenant-configuration';
import { TenantService } from '../service/tenant.service';
import { TenantStore } from '../store/tenant.store';

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
    private cdRef: ChangeDetectorRef,
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
      .subscribe(
        configProperties => (this.configurationProperties = configProperties)
      );
  }

  ngAfterViewInit() {
    setTimeout(() => this.tenantKeyInput.nativeElement.focus());
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );

    const newTenant: TenantConfiguration = {
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
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'tenant-config.errors.create'
            })
    );
  }

  updateConfigProperties() {
    const key = this.tenantForm.get('key').value.toUpperCase();
    const defaultDataBaseName = `reporting_${key}`;

    if (this.configurationProperties) {
      Object.keys(this.configurationProperties.datasources).forEach(
        dataSourceKey => {
          const dbProperty = <ConfigurationProperty>(
            this.configurationProperties.datasources[dataSourceKey].find(
              property => property.key === 'urlParts.database'
            )
          );
          dbProperty.value = defaultDataBaseName;
          dbProperty.originalValue = defaultDataBaseName;
        }
      );
    }
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
