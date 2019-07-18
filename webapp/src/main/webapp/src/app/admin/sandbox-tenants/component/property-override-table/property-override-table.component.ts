import { Component, Input } from '@angular/core';
import { ConfigurationProperty } from '../../model/configuration-property';
import { FormGroup } from '@angular/forms';

function rowTrackBy(index: number, value: ConfigurationProperty) {
  return value.key;
}

@Component({
  selector: 'property-override-table',
  templateUrl: './property-override-table.component.html',
  styleUrls: ['./property-override-table.component.less']
})
//TODO: Implement ControlValueAccessor
export class PropertyOverrideTableComponent {
  readonly rowTrackBy = rowTrackBy;

  private _configurationProperties: ConfigurationProperty[] = [];

  get configurationProperties(): ConfigurationProperty[] {
    return this._configurationProperties;
  }

  @Input()
  set configurationProperties(
    configurationProperties: ConfigurationProperty[]
  ) {
    this._configurationProperties = configurationProperties;

    if (
      !this.filteredConfigurationProperties &&
      configurationProperties.length > 0
    ) {
      this.filteredConfigurationProperties = configurationProperties;
    }
    this.updatePropertiesFilter();
  }

  @Input()
  propertiesArrayName: string;

  @Input()
  form: FormGroup;

  @Input()
  readonly = true;

  // filters in modified properties
  @Input()
  modified = false;

  filteredConfigurationProperties: ConfigurationProperty[];
  first = 0;

  constructor() {}

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
    if (this.modified) {
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
