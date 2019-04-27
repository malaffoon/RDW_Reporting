import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SandboxConfiguration } from './sandbox-configuration';
import { SandboxConfigurationProperty } from './sandbox-configuration-property';
import { RdwTranslateLoader } from '../../shared/i18n/rdw-translate-loader';
import { MenuItem } from 'primeng/api';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { SandboxService } from './sandbox.service';
import { ApplicationSettingsService } from '../../app-settings.service';
import { Utils } from '../../shared/support/support';

@Component({
  selector: 'sandbox-details-config',
  templateUrl: './sandbox-details.component.html'
})
export class SandboxConfigurationDetailsComponent implements OnInit {
  @Input()
  sandbox: SandboxConfiguration;
  @ViewChild('resetModal')
  resetModal;
  @ViewChild('archiveModal')
  archiveModal;
  @ViewChild('deleteModal')
  deleteModal;

  expanded = false;
  editMode = false;
  configurationProperties: SandboxConfigurationProperty[] = [];
  localizationOverrides: SandboxConfigurationProperty[] = [];
  menuItems: MenuItem[];
  sandboxForm: FormGroup;

  constructor(
    private translationLoader: RdwTranslateLoader,
    private service: SandboxService,
    private formBuilder: FormBuilder,
    private settingsService: ApplicationSettingsService
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [this.sandbox.label, Validators.required],
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
                new SandboxConfigurationProperty(
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
                new SandboxConfigurationProperty(key, value)
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
      let flattenedConfigProperties = Utils.flattenJsonObject(configProperties);
      Object.keys(flattenedConfigProperties).forEach(key => {
        const propertyOverrides = this.sandbox.configurationProperties || [];
        const override = propertyOverrides.find(
          property => property.key === key
        );
        if (override) {
          this.configurationProperties.push(
            new SandboxConfigurationProperty(
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
            new SandboxConfigurationProperty(key, val)
          );
          configPropertiesFormArray.push(new FormControl(val));
        }
      });
    });
  }

  onArchiveButtonClick() {
    //TODO: Call ARCHIVE API - update UI accordingly
  }

  onDeleteButtonClick() {
    //TODO: Call DELETE API and emit delete event
    this.service.delete(this.sandbox.code);
  }

  onResetButtonClick() {
    //TODO: Call DATA RESET API
  }

  onSubmit() {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const modifiedConfigurationProperties = this.configurationProperties.filter(
      property => property.originalValue !== property.value
    );
    let newSandbox = {
      code: this.sandbox.code,
      template: this.sandbox.template,
      ...this.sandboxForm.value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: modifiedConfigurationProperties
    };
    this.service.update(newSandbox);
    this.editMode = false;
  }

  updateOverride(override: SandboxConfigurationProperty, index: number): void {
    const overrides = <FormArray>(
      this.sandboxForm.controls['localizationOverrides']
    );
    const newVal = overrides.controls[index].value;

    let existingOverride = this.localizationOverrides[
      this.localizationOverrides.indexOf(override)
    ];
    existingOverride.value = newVal;
  }

  updateConfigurationProperty(
    property: SandboxConfigurationProperty,
    index: number
  ): void {
    const properties = <FormArray>(
      this.sandboxForm.controls['configurationProperties']
    );
    const newVal = properties.controls[index].value;

    let existingProperty = this.configurationProperties[
      this.configurationProperties.indexOf(property)
    ];
    existingProperty.value = newVal;
  }

  private configureMenuItems(): void {
    this.menuItems = [
      {
        label: 'Reset Data',
        icon: 'fa fa-refresh',
        command: () => this.resetModal.show()
      },
      {
        label: 'Archive',
        icon: 'fa fa-archive',
        command: () => this.archiveModal.show()
      },
      {
        label: 'Delete',
        icon: 'fa fa-close',
        command: () => this.deleteModal.show()
      }
    ];
  }
}
