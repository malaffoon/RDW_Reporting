import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
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
import { mapConfigurationProperties } from '../mapper/tenant.mapper';
import { ConfigurationProperty } from '../model/configuration-property';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { TenantConfiguration } from '../model/tenant-configuration';
import { SandboxService } from '../service/sandbox.service';

@Component({
  selector: 'new-sandbox',
  templateUrl: './new-sandbox.component.html'
})
export class NewSandboxConfigurationComponent implements OnInit, AfterViewInit {
  dataSets: DataSet[];
  tenants: TenantConfiguration[] = [];
  sandboxForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: ConfigurationProperty[] = [];
  defaultLocalizations: any;
  // Contains the full list of configuration properties, with default values
  configurationProperties: any;
  defaultConfigurationProperties: any;

  @ViewChild('sandboxLabelInput')
  sandboxLabelInput: ElementRef;

  constructor(
    private service: SandboxService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [null, CustomValidators.notBlank],
      description: [null],
      dataset: [null, Validators.required],
      tenant: [null, Validators.required],
      configurationProperties: this.formBuilder.group({}),
      localizationOverrides: this.formBuilder.group({})
    });

    this.sandboxForm.controls.tenant.valueChanges.subscribe(
      this.overridePropsFromTenenat.bind(this)
    );

    this.service
      .getAvailableDataSets()
      .subscribe(dataSets => (this.dataSets = dataSets));
    this.service.getTenants().subscribe(tenants => (this.tenants = tenants));
    this.loadLocalizations();

    this.service
      .getDefaultConfigurationProperties()
      .subscribe(configProperties => {
        this.defaultConfigurationProperties = configProperties;
        this.configurationProperties = mapConfigurationProperties(
          configProperties
        );
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.sandboxLabelInput.nativeElement.focus());
  }

  private overridePropsFromTenenat(tenant: TenantConfiguration) {
    this.configurationProperties = mapConfigurationProperties(
      this.defaultConfigurationProperties,
      tenant.configurationProperties
    );

    if (tenant.localizationOverrides) {
      this.mapLocalizationOverrides(
        this.defaultLocalizations,
        tenant.localizationOverrides
      );
    }
  }

  private loadLocalizations() {
    this.translationLoader
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        this.defaultLocalizations = translations;
        this.mapLocalizationOverrides(translations);
      });
  }

  private mapLocalizationOverrides(
    defaults: any,
    overrides?: ConfigurationProperty[]
  ): void {
    const localizations = [];
    const localizationOverrides = overrides || [];
    const locationOverrideFormGroup = <FormGroup>(
      this.sandboxForm.controls.localizationOverrides
    );

    for (let key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        const value = defaults[key];
        const override = localizationOverrides.find(o => o.key === key);
        if (override) {
          localizations.push(
            new ConfigurationProperty(key, override.value, undefined, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(
            override.value
          );
        } else {
          localizations.push(new ConfigurationProperty(key, value));
          locationOverrideFormGroup.controls[key] = new FormControl(value);
        }
      }
    }

    this.localizationOverrides = localizations;
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const newSandbox: SandboxConfiguration = {
      ...this.sandboxForm.value,
      dataSet: this.sandboxForm.value.dataset,
      parentTenantCode: this.sandboxForm.value.tenant.code,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.configurationProperties
    };

    this.service.create(newSandbox).subscribe(
      () => {
        this.router.navigate(['sandboxes']);
      },
      error =>
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'sandbox-config.errors.create'
            })
    );
  }
}
