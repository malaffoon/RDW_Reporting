import { NgModule } from '@angular/core';
import { ListGroupComponent } from './list-group.component';
import { EditableListGroupComponent } from './editable-list-group.component';
import { ActionableListGroupComponent } from './actionable-list-group.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ActionableListGroupComponent,
    EditableListGroupComponent,
    ListGroupComponent
  ],
  imports: [CommonModule],
  exports: [
    ActionableListGroupComponent,
    EditableListGroupComponent,
    ListGroupComponent
  ]
})
export class RdwListModule {}
