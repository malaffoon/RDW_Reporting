import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
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

@Component({
  selector: 'sandbox-details-config',
  templateUrl: './sandbox-details.component.html'
})
export class SandboxConfigurationDetailsComponent implements OnInit {
  @Input()
  sandbox: SandboxConfiguration;
  @Output()
  delete: EventEmitter<SandboxConfiguration> = new EventEmitter<
    SandboxConfiguration
  >();
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
  modifiedConfigurationProperties: SandboxConfigurationProperty[] = [];
  modifiedLocalizationOverrides: SandboxConfigurationProperty[] = [];
  menuItems: MenuItem[];
  sandboxForm: FormGroup;

  constructor(
    private translationLoader: RdwTranslateLoader,
    private service: SandboxService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [this.sandbox.label, Validators.required],
      description: [this.sandbox.description],
      configurationProperties: this.formBuilder.array([]),
      localizationOverrides: this.formBuilder.array([])
    });

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

    if (this.sandbox.configurationProperties) {
      this.sandbox.configurationProperties.forEach((value, key) =>
        this.configurationProperties.push(
          new SandboxConfigurationProperty(key, value)
        )
      );
    }

    this.configureMenuItems();
  }

  onArchiveButtonClick() {
    //TODO: Call ARCHIVE API - update UI accordingly
  }

  onDeleteButtonClick() {
    //TODO: Call DELETE API and emit delete event
    this.delete.emit(this.sandbox);
  }

  onResetButtonClick() {
    //TODO: Call DATA RESET API
  }

  onSubmit() {
    console.log(this.sandbox);
    let newSandbox = {
      key: this.sandbox.key,
      template: this.sandbox.template,
      ...this.sandboxForm.value,
      localizationOverrides: this.modifiedLocalizationOverrides
    };
    this.service.update(newSandbox);
    this.editMode = false;
  }

  updateOverride(override: SandboxConfigurationProperty, index: number): void {
    const overrides = <FormArray>(
      this.sandboxForm.controls['localizationOverrides']
    );
    const newVal = overrides.controls[index].value;

    if (this.modifiedLocalizationOverrides.indexOf(override) > -1) {
      let existingOverride = this.modifiedLocalizationOverrides[
        this.modifiedLocalizationOverrides.indexOf(override)
      ];
      existingOverride.value = newVal;
    } else {
      override.value = newVal;
      this.modifiedLocalizationOverrides.push(override);
    }
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
