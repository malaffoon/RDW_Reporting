import { Component, forwardRef, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControlValueAccessor } from "../shared/form/abstract-control-value-accessor";
import { Observable } from "rxjs/Observable";
import { District, Organization, OrganizationType, School } from "../shared/organization/organization";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { OrganizationTypeahead } from "../shared/organization/organization-typeahead";
import {
  AggregateReportOrganizationList,
  DefaultOrganizationSelection,
  OrganizationSelection
} from "./aggregate-report-organization-list.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Wrapper component for organization typeahead and organization list view
 */
@Component({
  selector: 'aggregate-report-organization-select',
  templateUrl: './aggregate-report-organization-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AggregateReportOrganizationSelect),
      multi: true
    }
  ]
})
export class AggregateReportOrganizationSelect extends AbstractControlValueAccessor<OrganizationSelection> implements OnInit {

  @ViewChild('typeahead')
  typeahead: OrganizationTypeahead;

  typeaheadOptions: Observable<Organization[]>;

  @ViewChild('list')
  list: AggregateReportOrganizationList;

  constructor(private organizationService: AggregateReportOrganizationService) {
    super();
  }

  ngOnInit(): void {
    this.typeaheadOptions = Observable.create(observer => {
      observer.next(this.typeahead.value);
    }).mergeMap(search => this.organizationService.getOrganizationsMatchingName(search));
    this.value = new DefaultOrganizationSelection();
  }

  get value(): any {
    return this.list.value;
  }

  set value(value: any) {
    this.list.value = value;
  }

  get statewideUser(): boolean {
    return this.list.statewideUser;
  }

  @Input()
  set statewideUser(value: boolean) {
    this.list.statewideUser = value;
  }

  onTypeaheadSelect(organization: any): void {
    this.typeahead.value = '';
    if (organization.type === OrganizationType.District) {
      const district: District = <District>organization;
      this.value.districtSelectionById.set(district.id, {
        organization: district,
        includeAllSchools: false
      });
    } else if (organization.type === OrganizationType.School) {
      const school: School = <School>organization;
      this.value.schoolSelectionById.set(school.id, {
        organization: school,
        includeDistrict: false
      });
    }
  }

}
