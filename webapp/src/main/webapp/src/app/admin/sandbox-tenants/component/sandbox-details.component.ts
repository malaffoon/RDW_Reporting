import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SandboxConfiguration } from '../model/sandbox-configuration';
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
import { SandboxService } from '../service/sandbox.service';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { flattenJsonObject } from '../../../shared/support/support';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../../shared/validator/custom-validators';

@Component({
  selector: 'sandbox-details-config',
  templateUrl: './sandbox-details.component.html'
})
export class SandboxConfigurationDetailsComponent implements OnInit {
  @Input()
  sandbox: SandboxConfiguration;
  @Output()
  deleteClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();
  @Output()
  archiveClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();
  @Output()
  resetDataClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();

  expanded = false;
  editMode = false;
  configurationProperties: ConfigurationProperty[] = [];
  localizationOverrides: ConfigurationProperty[] = [];
  menuItems: MenuItem[];
  sandboxForm: FormGroup;
  tempForm: FormGroup;

  constructor(
    private translationLoader: RdwTranslateLoader,
    private translateService: TranslateService,
    private service: SandboxService,
    private formBuilder: FormBuilder,
    private settingsService: ApplicationSettingsService
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [this.sandbox.label, CustomValidators.notBlank],
      description: [this.sandbox.description],
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
            this.sandboxForm.controls['localizationOverrides']
          );
          if (translations.hasOwnProperty(key)) {
            const value = translations[key];
            const localizationOverrides =
              this.sandbox.localizationOverrides || [];
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
        this.sandboxForm.controls['configurationProperties']
      );
      let flattenedConfigProperties = flattenJsonObject(configProperties);
      Object.keys(flattenedConfigProperties).forEach(key => {
        const propertyOverrides = this.sandbox.configurationProperties || [];
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
    this.tempForm = cloneDeep(this.sandboxForm);
    this.editMode = true;
  }

  cancelClicked(): void {
    this.sandboxForm = cloneDeep(this.tempForm);
    this.editMode = false;
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const modifiedConfigurationProperties = this.configurationProperties.filter(
      property => property.originalValue !== property.value
    );
    let newSandbox = {
      code: this.sandbox.code,
      dataSet: this.sandbox.dataSet,
      ...this.sandboxForm.value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: modifiedConfigurationProperties
    };
    this.service.update(newSandbox);
    this.editMode = false;
  }

  private configureMenuItems(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('sandbox-config.actions.reset'),
        icon: 'fa fa-refresh',
        command: () => this.resetDataClicked.emit(this.sandbox)
      },
      {
        label: this.translateService.instant('sandbox-config.actions.archive'),
        icon: 'fa fa-archive',
        command: () => this.archiveClicked.emit(this.sandbox)
      },
      {
        label: this.translateService.instant('sandbox-config.actions.delete'),
        icon: 'fa fa-close',
        command: () => this.deleteClicked.emit(this.sandbox)
      }
    ];
  }
}
