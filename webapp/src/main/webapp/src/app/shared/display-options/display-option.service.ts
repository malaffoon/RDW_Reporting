import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PerformanceLevelDisplayTypes } from "./performance-level-display-type";
import { ValueDisplayTypes } from "./value-display-type";

@Injectable()
export class DisplayOptionService {

  constructor(private translateService: TranslateService) {
  }

  getValueDisplayTypeOptions(): any[] {
    return ValueDisplayTypes.values()
      .map(this.createOptionMapper(
        value => this.translateService.instant(`common.value-display-type.${value}`),
        value => `Value Display Type: ${value}`
      ));;
  }

  getPerformanceLevelDisplayTypeOptions(): any[] {
    return PerformanceLevelDisplayTypes.values()
      .map(this.createOptionMapper(
        value => this.translateService.instant(`common.performance-level-display-type.${value}`),
        value => `Achievement Level Display Type: ${value}`
      ));
  }

  createOptionMapper(translationProvider: (value: any) => string, labelProvider: (value: any) => string): any {
    return (value: any) => <any>{
      value: value,
      text: translationProvider(value),
      label: labelProvider(value)
    };
  }

}
