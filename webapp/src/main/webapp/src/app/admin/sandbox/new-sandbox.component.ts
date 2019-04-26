import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataTemplate } from './sandbox-configuration';
import { SandboxService } from './sandbox.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';
import { RdwTranslateLoader } from '../../shared/i18n/rdw-translate-loader';
import { SandboxConfigurationProperty } from './sandbox-configuration-property';

@Component({
  selector: 'new-sandbox',
  templateUrl: './new-sandbox.component.html'
})
export class NewSandboxConfigurationComponent {
  dataTemplates: DataTemplate[];
  sandboxForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: SandboxConfigurationProperty[] = [];
  // Contains the full list of configuration properties, with default values
  configurationProperties: SandboxConfigurationProperty[] = [];

  constructor(
    private service: SandboxService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [null, Validators.required],
      description: [null],
      template: [null, Validators.required],
      configurationProperties: this.formBuilder.array([]),
      localizationOverrides: this.formBuilder.array([])
    });

    this.service
      .getAvailableDataTemplates()
      .subscribe(templates => (this.dataTemplates = templates));

    this.translationLoader
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        let locationOverrideFormArray = <FormArray>(
          this.sandboxForm.controls['localizationOverrides']
        );
        for (let key in translations) {
          // check also if property is not inherited from prototype
          if (translations.hasOwnProperty(key)) {
            let value = translations[key];
            this.localizationOverrides.push(
              new SandboxConfigurationProperty(key, value)
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
    const newSandbox = {
      ...this.sandboxForm.value,
      code: randomCode,
      localizationOverrides: modifiedLocalizationOverrides
    };
    this.service.create(newSandbox);
    this.router.navigate(['sandboxes']);
  }

  updateOverride(override: SandboxConfigurationProperty, index: number): void {
    const overrides = <FormArray>(
      this.sandboxForm.controls['localizationOverrides']
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
}
