import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'adv-filters',
  templateUrl: './adv-filters.component.html'
})
export class AdvFiltersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get translateRoot() {
    return "labels.groups.results.adv-filters.";
  }

}
