import { District, School } from "../shared/organization/organization";
import { AbstractControlValueAccessor } from "../shared/form/abstract-control-value-accessor";
import { Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

const OrganizationComparator = (a, b) => a.organization.name.localeCompare(b.organization.name);

@Component({
  selector: 'aggregate-report-organization-list',
  templateUrl: './aggregate-report-organization-list.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AggregateReportOrganizationList),
      multi: true
    }
  ]
})
export class AggregateReportOrganizationList extends AbstractControlValueAccessor<OrganizationSelection> {

  @Input()
  statewideUser: boolean = false;

  constructor() {
    super();
    this._value = new DefaultOrganizationSelection();
  }

  get stateSelection(): StateSelection {
    return this.value.stateSelection;
  }

  get districtSelections(): DistrictSelection[] {
    return Array.from(this.value.districtSelectionById.values())
      .sort(OrganizationComparator);
  }

  get schoolSelections(): SchoolSelection[] {
    return Array.from(this.value.schoolSelectionById.values())
      .sort(OrganizationComparator);
  }

  private removeDistrict(district: District): void {
    this.value.districtSelectionById.delete(district.id);
  }

  private removeSchool(school: School): void {
    this.value.schoolSelectionById.delete(school.id);
  }

}

export interface OrganizationSelection {
  readonly stateSelection: StateSelection;
  readonly districtSelectionById: Map<number, DistrictSelection>;
  readonly schoolSelectionById: Map<number, SchoolSelection>;
}

export interface StateSelection {
  readonly includeRollup: boolean;
  readonly includeAllDistricts: boolean;
}

export interface SchoolSelection {
  readonly organization: School;
  readonly includeDistrict: boolean;
}

export interface DistrictSelection {
  readonly organization: District;
  readonly includeAllSchools: boolean;
}

export class DefaultOrganizationSelection implements OrganizationSelection {
  stateSelection: StateSelection = { includeRollup: true, includeAllDistricts: false };
  districtSelectionById: Map<number, DistrictSelection> = new Map<number, DistrictSelection>();
  schoolSelectionById: Map<number, SchoolSelection> = new Map<number, SchoolSelection>();
}
