import { Component, Input, OnInit } from "@angular/core";
import { Utils } from "./Utils";

/*
  A generic component which builds and binds a checkbox list in which
  All and the array of values are mutually exclusive.
  All | (Option 1)
      | (Option 2)
      | (Option 3)
      | (Option 4) ...
 */
@Component({
  selector: 'sb-checkbox-list',
  template: `
    <div class="btn-group nested-btn-group-sm toggle-group vertical" data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{'active': modelValue[0] }">
        <input type="checkbox" [(ngModel)]="modelValue[0]" (ngModelChange)="allChange($event)" autocomplete="off" checked=""> {{ 'buttons.all' | translate }}
      </label>
      <div class="btn-group">
        <label *ngFor="let value of values;" class="btn btn-primary" [ngClass]="{'active': modelValue[value] }">
          <input type="checkbox" [(ngModel)]="modelValue[value]" (ngModelChange)="valueChange($event)"  autocomplete="off"> {{ enum + '.' + value | translate }}
        </label>
    </div>
`
})
export class SBCheckboxList implements OnInit {
  // An array of values which must map to the given enum.
  @Input()
  public values: any[]

  // An enum defined in the translations which has a value.
  @Input()
  public enum: string;

  // The property to update and show.
  @Input()
  public property: string;

  // The model to bind to which contains the property.  (Allows us to pass by reference)
  @Input()
  public model: any;

  private _name: string;

  get name(): string {
    return this._name;
  }

  get modelValue() {
    return this.model[this.property];
  }

  set modelValue(value) {
    this.model[this.property] = value;
  }

  constructor() {
    // Required to have a unique name on the page or face ngModel data binding issues.
    this._name = Utils.newGuid();
  }

  ngOnInit(): void {
    this.setValuesToFalse();
  }

  allChange(newValue) {
    if(newValue) {
      this.setValuesToFalse();
    }
    else {
      // Don't allow All to be to set to false by clicking.
      this.modelValue[0] = true;
    }
  }

  valueChange(value) {
    // Set all to true if all options are false.
    this.modelValue[0] = this.setAllValuesAreFalse();
  }

  private setAllValuesAreFalse() : boolean {
    for (let i = 0; i < this.values.length; i++) {
      if(this.modelValue[ this.values[ i ] ])
        return false;
    }

    return true;
  }

  private setValuesToFalse() {
    for (let i = 0; i < this.values.length; i++) {
      this.modelValue[ this.values[ i ] ] = false
    }
  }
}
