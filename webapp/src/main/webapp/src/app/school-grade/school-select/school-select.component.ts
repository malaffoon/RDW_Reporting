import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { School } from "../../user/model/school.model";
import { OrganizationService } from "../organization.service";
import { isNullOrUndefined } from "util";

/**
 * @deprecated use search-select.ts
 */
@Component({
  selector: 'school-select',
  templateUrl: './school-select.component.html'
})
export class SchoolSelectComponent implements OnInit {

  @Input()
  availableSchools: School[];

  @Output()
  schoolChanged: EventEmitter<School> = new EventEmitter();

  @Input()
  selectedSchool: School;

  selectedSchoolName: string;
  schoolsMatchingSearch: School[] = [];
  schoolDropdownOptions: any[] = [];

  constructor(private organizationService: OrganizationService) {
  }

  get showDropdown() {
    return isNullOrUndefined(this.availableSchools) || this.availableSchools.length < 1;
  }

  ngOnInit() {
    if (isNullOrUndefined(this.availableSchools))
      return;

    if (this.showDropdown) {
      if (this.availableSchools.length == 1) {
        this.selectedSchool = this.availableSchools[ 0 ];
        this.schoolChanged.emit(this.selectedSchool);
      }

      this.schoolDropdownOptions = this.availableSchools.map(school => {
        return {
          label: school.name,
          value: school
        };
      });
    } else {
      this.organizationService.getSchoolsWithDistricts().subscribe(schools => {
        this.availableSchools = schools;
      });

      if (this.selectedSchool) {
        this.selectedSchoolName = this.selectedSchool.name;
      }
    }

  }

  schoolTextChanged(event) {
    if (this.selectedSchool) {
      this.selectedSchool = null;
      this.schoolChanged.emit(this.selectedSchool);
    }
  }

  schoolSelect(event) {
    this.selectedSchool = event;
    this.schoolChanged.emit(event);
  }
}
