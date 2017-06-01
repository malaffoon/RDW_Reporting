import { Component, OnInit } from '@angular/core';
import { FilterBy } from "../model/filter-by.model";

@Component({
  selector: 'adv-filters',
  templateUrl: './adv-filters.component.html'
})
export class AdvFiltersComponent implements OnInit {
  private _filterBy: FilterBy;

  get filterBy(): FilterBy {
    return this._filterBy;
  }

  set filterBy(value: FilterBy) {
    this._filterBy = value;
  }

  constructor() {
    this._filterBy = new FilterBy();
  }

  ngOnInit() {
  }

  get translateRoot() {
    return "labels.groups.results.adv-filters.";
  }
}
