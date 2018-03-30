import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubgroupFilters } from './subgroup-filters';

@Component({
  selector: 'subgroup-filters-list',
  templateUrl: 'subgroup-filters-list.component.html'
})
export class SubgroupFiltersListComponent {

  @Output()
  itemRemoved: EventEmitter<SubgroupFilters> = new EventEmitter();

  private _items: any[] = [];

  get items(): any[] {
    return this._items;
  }

  @Input()
  set items(items: any[]) {
    this._items = items ? items.concat() : [];
  }

}
