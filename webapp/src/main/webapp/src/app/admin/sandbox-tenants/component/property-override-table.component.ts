import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'property-override-table',
  templateUrl: './property-override-table.component.html'
})
//TODO: Implement ControlValueAccessor
export class PropertyOverrideTableComponent implements OnInit {
  @Input()
  configurationProperties: ConfigurationProperty[] = [];
  @Input()
  propertiesArrayName: string;
  @Input()
  form: FormGroup;

  showModifiedPropertiesOnly = false;
  filteredConfigurationProperties: ConfigurationProperty[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filteredConfigurationProperties = this.configurationProperties;
  }

  updateOverride(override: ConfigurationProperty, index: number): void {
    const overrides = <FormArray>this.form.controls[this.propertiesArrayName];
    const newVal = overrides.controls[index].value;

    let existingOverride = this.configurationProperties[
      this.configurationProperties.indexOf(override)
    ];
    existingOverride.value = newVal;
  }

  updatePropertiesFilter(): void {
    this.showModifiedPropertiesOnly
      ? (this.filteredConfigurationProperties = this.configurationProperties.filter(
          prop => prop.value !== prop.originalValue
        ))
      : (this.filteredConfigurationProperties = this.configurationProperties);
  }

  resetClicked(override: ConfigurationProperty) {
    override.value = override.originalValue;
    this.updatePropertiesFilter();
  }
}
