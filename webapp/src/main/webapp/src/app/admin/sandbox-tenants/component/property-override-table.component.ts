import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { FormArray, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { DataTable } from 'primeng/primeng';

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
  @ViewChild('dt') dataTable: DataTable;

  showModifiedPropertiesOnly = false;
  filteredConfigurationProperties: ConfigurationProperty[] = [];
  first = 0;

  constructor() {}

  ngOnInit(): void {
    this.filteredConfigurationProperties = this.configurationProperties;
  }

  updateOverride(override: ConfigurationProperty): void {
    const formGroup = <FormGroup>this.form.controls[this.propertiesArrayName];
    const formControl = formGroup.controls[override.key];
    const newVal = formControl.value;
    const configurationProperty = this.configurationProperties.find(
      property => property.key === override.key
    );

    configurationProperty.value = newVal;
    override.value = newVal;
  }

  updatePropertiesFilter(): void {
    if (this.showModifiedPropertiesOnly) {
      this.filteredConfigurationProperties = this.configurationProperties.filter(
        prop => prop.value !== prop.originalValue
      );
    } else {
      this.filteredConfigurationProperties = this.configurationProperties;
    }
    // Reset the page back to the first page. Otherwise we can end up "trapped" in an empty page
    this.first = 0;
  }

  resetClicked(override: ConfigurationProperty) {
    override.value = override.originalValue;
    this.updatePropertiesFilter();
  }
}
