import { Component, Input } from '@angular/core';
import { Group } from './group';

@Component({
  selector: 'group-table',
  templateUrl: 'group-table.component.html'
})
export class GroupTableComponent {

  @Input()
  groups: Group[];

  columns: Column[] = [
    new Column({ id: 'group', field: 'name' }),
    new Column({ id: 'school', field: 'schoolName' }),
    new Column({ id: 'subject', field: 'subjectCode' })
  ];

  /**
   * Determines if the empty message displayed should be for when there are groups and the filter didn't have any matches
   * or if there were never any groups to start with
   *
   * @returns {string} translation key to use
   */
  get emptyMessageTranslateKey(): string {
    return this.groups && this.groups.length ?
      'groups.empty-message' :
      'groups.no-groups-message';
  }

}

class Column {
  id: string;
  field: string;

  constructor({ id, field = '' }) {
    this.id = id;
    this.field = field;
  }
}
