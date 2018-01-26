import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Organization } from "./organization";
import { AbstractControlValueAccessor } from "../form/abstract-control-value-accessor";

@Component({
  selector: 'organization-typeahead',
  template: `
    <input class="form-control"
           id="organization-name"
           name="organization-name"
           [disabled]="disabled"
           [typeahead]="options"
           (typeaheadLoading)="loadingInternal = $event"
           (typeaheadNoResults)="noResultsInternal = $event"
           (typeaheadOnSelect)="select.emit($event.item)"
           [typeaheadMinLength]="3"
           [(ngModel)]="value"
           [typeaheadItemTemplate]="organizationTemplate"
           typeaheadOptionField="name"
           placeholder="{{'labels.instructional-resource.form.organization-name' | translate}}">
    <div>
      <br [hidden]="loadingInternal || noResultsInternal">
      <span [hidden]="!noResultsInternal" class="small gray-darker">{{'labels.instructional-resource.organizations.no-results' | translate}}</span>
      <span [hidden]="!loadingInternal"><i class="fa fa-spinner"></i></span>
    </div>
    <ng-template #organizationTemplate let-organization="item" let-index="index" let-query="query">
      <p class="mb-0">{{organization.name}}</p>
      <p class="h6"><span class="label label-default">{{'labels.type' | translate}}</span> {{ ('common.organization.type.' + organization.type) | translate }}</p>
    </ng-template>
  `
})
export class OrganizationTypeahead extends AbstractControlValueAccessor<string> {

  @Input()
  options: Observable<Organization[]> | Organization[];

  @Output()
  select: EventEmitter<Organization> = new EventEmitter<Organization>();

  loadingInternal: boolean = false;
  noResultsInternal: boolean = false;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

}
