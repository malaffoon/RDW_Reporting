import { Component, Input, OnInit } from '@angular/core';
import { UserGroup } from './user-group';

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

@Component({
  selector: 'user-group-table',
  templateUrl: './user-group-table.component.html'
})
export class UserGroupTableComponent implements OnInit {

  @Input()
  groups: UserGroup[];

  @Input()
  emptyMessage: string;

  columns: Column[] = [
    new Column({ id: 'group', field: 'name' }),
    new Column({ id: 'subject', field: 'subjects' }),
    new Column({ id: 'action' })
  ];

}
