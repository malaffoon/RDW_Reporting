import { Component, Input } from '@angular/core';
import { UserGroup } from './user-group';

@Component({
  selector: 'user-groups-table',
  templateUrl: 'user-groups-table.component.html'
})
export class UserGroupsTableComponent {

  @Input()
  groups: UserGroup[];

  columns: Column[] = [
    new Column({id: 'group', field: 'name'}),
    new Column({id: 'subject', field: 'subjectCodes'})
  ];

}

class Column {
  id: string;
  field: string;

  constructor({
                id,
                field = ''
              }) {
    this.id = id;
    this.field = field;
  }

}
