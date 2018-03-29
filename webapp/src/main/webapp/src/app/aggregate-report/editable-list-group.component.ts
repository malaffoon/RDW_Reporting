import {Organization} from "../shared/organization/organization";
import {Component, ContentChild, EventEmitter, Input, Output, TemplateRef} from "@angular/core";
import {ListGroupComponent} from "./list-group.component";

@Component({
  selector: 'editable-list-group',
  template: `
    <ng-template #defaultItemTemplate let-item>{{item}}</ng-template>
    <ng-template #editableItemTemplate let-item>
      <a *ngIf="!disabled"
         class="mr-xs"
         href="javascript:void(0)"
         (click)="itemRemoveButtonClick.emit(item)"><i class="fa fa-close"></i></a>
      <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate; context: {$implicit: item}">
      </ng-container>
    </ng-template>
    
    <list-group [items]="items"
                [itemTemplate]="editableItemTemplate">
    </list-group>
  `
})
export class EditableListGroupComponent extends ListGroupComponent {

  @Output()
  itemRemoveButtonClick: EventEmitter<Organization> = new EventEmitter<Organization>();

}

