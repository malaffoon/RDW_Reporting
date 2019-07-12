import {
  AfterViewInit,
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
import { forOwn } from 'lodash';
import { LanguageStore } from '../../../shared/i18n/language.store';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { NotificationService } from '../../../shared/notification/notification.service';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../model/configuration-property';
import { TenantConfiguration } from '../model/tenant-configuration';
import { TenantService } from '../service/tenant.service';
import { TenantStore } from '../store/tenant.store';
import { getModifiedConfigProperties } from '../mapper/tenant.mapper';

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

  // True if two or more different passwords has been set for the same username
  passwordMismatch: boolean = false;

  constructor(
    private service: TenantService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private languageStore: LanguageStore,
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
      configurationProperties: getModifiedConfigProperties(
        this.configurationProperties
      )
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
    const key = this.tenantForm.get('key').value.toLowerCase();
    const defaultDataBaseName = `reporting_${key}`;
    const defaultUsername = key;

    if (this.configurationProperties) {
      Object.keys(this.configurationProperties.datasources).forEach(
        dataSourceKey => {
          const dataSource = this.configurationProperties.datasources[
            dataSourceKey
          ];
          const urlPartsDatabase = <ConfigurationProperty>(
            dataSource.find(property => property.key === 'urlParts.database')
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
        }
      );
    }
  }

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

  private mapLocalizationOverrides() {
    this.translationLoader
      .getFlattenedTranslations(this.languageStore.currentLanguage)
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
