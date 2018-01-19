import { Component, forwardRef, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const NOOP: () => void = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SBCheckboxGroup),
  multi: true
};

/**
 * A checkbox group with an all option for convenience
 *
 * All | (Option 1)
 *     | (Option 2)
 *     | (Option 3)
 *     | (Option 4)
 */
@Component({
  selector: 'sb-checkbox-group',
  template: `
    <div [ngClass]="{'vertical': !this.horizontal}"
         class="nested-btn-group btn-group-sm toggle-group"
         data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{'active': selectedAllOptionInternal }">
        <input type="checkbox"
               [(ngModel)]="selectedAllOptionInternal"
               (ngModelChange)="allOptionChangedInternal()"
               autocomplete="off"
               checked=""
               angulartics2On="click"
               [angularticsEvent]="analyticsEvent"
               [angularticsCategory]="analyticsCategory"
               [angularticsProperties]="allOptionAnalyticsProperties">
        {{'buttons.all' | translate}}
      </label>
      <div class="btn-group">
        <label *ngFor="let option of options; let i = index" class="btn btn-primary"
               [ngClass]="{'active': selectedOptionsInternal[ i ] }">
          <input type="checkbox"
                 [(ngModel)]="selectedOptionsInternal[ i ]"
                 (ngModelChange)="optionChangedInternal()"
                 autocomplete="off"
                 [attr.selected]="selectedOptionsInternal[ i ] ? 'true' : 'false'"
                 angulartics2On="click"
                 [angularticsEvent]="analyticsEvent"
                 [angularticsCategory]="analyticsCategory"
                 [angularticsProperties]="option.analyticsProperties">
          {{option.text}}
        </label>
      </div>
    </div>
  `,
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
export class SBCheckboxGroup implements ControlValueAccessor, OnInit {

  @Input()
  public horizontal: boolean = false;

  @Input()
  public analyticsEvent: string;

  @Input()
  public analyticsCategory: string;

  @Input()
  public allOptionAnalyticsProperties: any = {};

  private _options: Option[];
  private _value: any[] = [];
  private _onTouchedCallback: () => void = NOOP;
  private _onChangeCallback: (_: any) => void = NOOP;

  // internal properties necessarily made public for ng build --prod
  // these are also needed for (ngModelChange) to fire
  public selectedAllOptionInternal: boolean = true;
  public selectedOptionsInternal: boolean[] = [];

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (options == null || typeof options === 'undefined') {
      this.throwError('options must not be null or undefined');
    }
    this._options = options.map(option => <Option>{
      value: option.value,
      text: option.text ? option.text : option.value,
      analyticsProperties: option.analyticsProperties
    });
  }

  get value(): any[] {
    return this._value;
  }

  set value(value: any[]) {
    value = value || [];
    this.selectedAllOptionInternal = value.length === this.options.length;
    this.selectedOptionsInternal = this.selectedAllOptionInternal
      ? [] : this.options.map(option => value.indexOf(option.value) != -1);
  }

  private set valueInternal(value: any[]) {
    value = value || [];
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  ngOnInit() {
    if (this.options === undefined) {
      this.throwError('options must not be null');
    }
  }

  optionChangedInternal(): void {
    this.selectedAllOptionInternal = this.selectedOptionsInternal.every(selected => !selected);
    this.updateValue();
  }

  allOptionChangedInternal(): void {
    this.selectedAllOptionInternal = true;
    this.selectedOptionsInternal = [];
    this.updateValue();
  }

  private updateValue(): void {
    const selectedOptions = this.selectedAllOptionInternal
      ? this.options
      : this.options.filter((option, index) => this.selectedOptionsInternal[ index ]);
    this.valueInternal = selectedOptions.map(option => option.value);
  }

  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
  }

  /**
   * @override
   * @inheritDoc
   */
  writeValue(value: any[]): void {
    this.value = value;
  }

  /**
   * @override
   * @inheritDoc
   */
  registerOnChange(callback: any): void {
    this._onChangeCallback = (callback !== null ? callback : NOOP);
  }

  /**
   * @override
   * @inheritDoc
   */
  registerOnTouched(callback: any): void {
    this._onTouchedCallback = (callback !== null ? callback : NOOP);
  }

}

/**
 * Describes what properties to give to the checkbox's options instances when initializing it.
 *
 * TODO share with sb-toggle
 */
export interface Option {
  value: any;
  text?: string;
  analyticsProperties?: any;
}
