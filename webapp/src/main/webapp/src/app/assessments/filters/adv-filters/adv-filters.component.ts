import { Component, Input, OnInit } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";
import { ActivatedRoute } from '@angular/router';

/*
  This component contains all of the selectable advanced filters
  for a group.
 */
@Component({
  selector: 'adv-filters',
  templateUrl: './adv-filters.component.html'
})
export class AdvFiltersComponent {
  private _filterBy: FilterBy;

  get filterBy(): FilterBy {
    return this._filterBy;
  }

  @Input()
  set filterBy(value: FilterBy) {
    this._filterBy = value;
  }

  @Input()
  filterOptions: ExamFilterOptions;

  @Input()
  showStudentFilter: boolean = true;

  showTransferAccess: boolean = false;

  constructor(private route: ActivatedRoute) {
    const { applicationSettings } = this.route.snapshot.data;
    this.showTransferAccess = applicationSettings.transferAccess;
  }

  get translateRoot() {
    return "labels.filters.";
  }

}
