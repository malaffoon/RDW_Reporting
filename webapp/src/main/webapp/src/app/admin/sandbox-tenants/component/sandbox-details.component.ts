import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { ConfigurationProperty } from '../model/configuration-property';
import { MenuItem } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { SandboxService } from '../service/sandbox.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { SandboxStore } from '../store/sandbox.store';
import { NotificationService } from '../../../shared/notification/notification.service';
import { UserService } from '../../../user/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sandbox-details-config',
  templateUrl: './sandbox-details.component.html'
})
export class SandboxConfigurationDetailsComponent implements OnInit, OnChanges {
  @Input()
  localizationDefaults: any;
  @Input()
  sandbox: SandboxConfiguration;
  @Output()
  deleteClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();

  expanded = false;
  editMode = false;
  readonly = true;
  configurationProperties: any;
  localizationOverrides: ConfigurationProperty[] = [];
  sandboxForm: FormGroup;
  tempForm: FormGroup;

  constructor(
    private store: SandboxStore,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private service: SandboxService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    /*
      Both `sandbox` and `localizationDefaults` are provided by the parent component and fetched with asynchronous
      service calls, so he we need to ensure that the sandbox and defaults have been defined, and that the form is
      initialized.
     */
    if (this.sandbox && this.localizationDefaults) {
      // Make sure a form has been initialized before mapping and processing overrides
      if (!this.sandboxForm) {
        this.initializeForm();
      }
      this.mapLocalizationOverrides(this.localizationDefaults);
    }
  }

  ngOnInit(): void {
    this.initializeForm();

    this.userService.getUser().subscribe(user => {
      this.readonly = !user.permissions.some(perm => perm === 'TENANT_WRITE');
    });
  }

  private initializeForm() {
    if (!this.sandboxForm) {
      this.sandboxForm = this.formBuilder.group({
        label: [this.sandbox.label, CustomValidators.notBlank],
        description: [this.sandbox.description],
        configurationProperties: this.formBuilder.group({}),
        localizationOverrides: this.formBuilder.group({})
      });
    }
  }

  private mapLocalizationOverrides(localizationDefaults: any): void {
    for (let key in localizationDefaults) {
      const locationOverrideFormGroup = <FormGroup>(
        this.sandboxForm.controls['localizationOverrides']
      );
      if (localizationDefaults.hasOwnProperty(key)) {
        const value = localizationDefaults[key];
        const localizationOverrides = this.sandbox.localizationOverrides || [];
        const override = localizationOverrides.find(o => o.key === key);
        if (override) {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, override.value, undefined, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(
            override.value
          );
        } else {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(value);
        }
      }
    }
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

    const updatedSandbox = {
      code: this.sandbox.code,
      dataSet: this.sandbox.dataSet,
      ...this.sandboxForm.value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.sandbox.configurationProperties
    };
    this.service.update(updatedSandbox).subscribe(
      () => {
        this.store.setState(
          this.store.state.map(existing =>
            existing.code === updatedSandbox.code ? updatedSandbox : existing
          )
        );
        this.editMode = false;
      },
      error =>
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'sandbox-config.errors.update'
            })
    );
  }
}
