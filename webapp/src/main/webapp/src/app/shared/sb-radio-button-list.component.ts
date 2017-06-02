import { Component, Input } from "@angular/core";

@Component({
  selector: 'sb-radio-button-list',
  template: `
    <div class="btn-group nested-btn-group-sm toggle-group" data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{'active': model[property] == -1 }">
        <input [value]="-1" [(ngModel)]="model[property]" type="radio" [name]="name" >{{ 'buttons.all' | translate }}
      </label>
      <div class="btn-group">
        <label *ngFor="let value of values" class="btn btn-primary" [ngClass]="{'active': model[property] == value }">
          <input [value]="value" [(ngModel)]="model[property]" type="radio" [name]="name">{{ enum + '.' + value | translate }}
        </label>
      </div>
    </div>`
})
export class SBRadioButtonComponent {
  @Input()
  public values: number[];

  @Input()
  public enum: string;

  @Input()
  public property: string;

  @Input()
  public model: any;

  private _name: string;

  get name(): string {
    return this._name;
  }

  constructor() {
    this._name = Guid.newGuid();
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
