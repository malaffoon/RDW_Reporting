import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild
} from '@angular/core';
import { Forms } from './forms';
import { AbstractControlValueAccessor } from './abstract-control-value-accessor';
import { isEqual } from 'lodash';
import { Utils } from '../support/support';
import { Option } from './option';
import { AutoComplete } from 'primeng/primeng';

/**
 * Holds the internal button selection state
 */
interface State {
  /**
   * True when the all option is selected
   */
  selectedAllOption: boolean;

  /**
   * Holds all selected option buttons
   */
  selectedOptions: Set<Option>;
}

/**
 * Default component styles
 */
const DefaultButtonGroupStyles = 'btn-group-sm';
const DefaultButtonStyles = 'btn-primary';

/**
 * A group of one or more selections made via a typeahead/autocomplete input field
 */
@Component({
  selector: 'sb-typeahead-group',
  template: `
    <ng-template #button let-option let-isAllOption="isAllOption">
      <label
        class="btn"
        [ngClass]="
          computeStylesInternal(buttonStyles, {
            active: isAllOption
              ? stateInternal.selectedAllOption
              : stateInternal.selectedOptions.has(option),
            disabled: option.disabled
          })
        "
      >
        <input
          type="checkbox"
          [attr.checked]="
            isAllOption
              ? stateInternal.selectedAllOption
              : stateInternal.selectedOptions.has(option)
          "
          [name]="name"
          [disabled]="option.disabled"
          (click)="onAllOptionClickInternal()"
        />
        {{ option.text }}
      </label>
    </ng-template>

    <div
      *ngIf="initializedInternal"
      data-toggle="buttons"
      class="typeahead-group all-option btn-group-sm vertical nested-btn-group"
    >
      <ng-container
        *ngTemplateOutlet="
          button;
          context: {
            $implicit: { text: 'common.buttons.all' | translate },
            isAllOption: true
          }
        "
      ></ng-container>

      <div class="btn-group chips" [ngClass]="buttonGroupStyles">
        <p-autoComplete
          #autoComplete
          [(ngModel)]="options"
          [autoHighlight]="true"
          [suggestions]="filteredOptions"
          [multiple]="true"
          dataKey="value"
          (completeMethod)="search($event)"
          (onSelect)="optionSelected($event)"
          (keydown)="onKeydown($event)"
          styleClass="wid100"
          [minLength]="0"
          [dropdown]="true"
          [placeholder]="placeholder"
          [scrollHeight]="'158px'"
          field="text"
        >
        </p-autoComplete>
        <div class="languages-container btn-group-sm">
          <ng-container *ngFor="let option of options">
            <label class="btn btn-primary active"
              >{{ option.text }}
              <i
                class="fa fa-times fa-lg pull-right"
                tabindex="0"
                (click)="removeOption(option)"
                (keyup.enter)="removeOption(option)"
              ></i>
            </label>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  providers: [Forms.valueAccessor(SBTypeaheadGroup)]
})
export class SBTypeaheadGroup extends AbstractControlValueAccessor<any[]>
  implements OnInit {
  private _options: Option[];
  private _initialOptions: Option[] = [];
  private _initialValues: any[];
  private _initialized: boolean = false;
  private _buttonStyles: any = DefaultButtonStyles;
  private _buttonGroupStyles: any = DefaultButtonGroupStyles;
  private _state: State;

  @ViewChild('autoComplete')
  autoComplete: AutoComplete;

  filteredOptions: any[];
  @Input()
  placeholder = '';

  @Input()
  suggestions: Option[];

  @Input()
  initialOptions: Option[];

  // An enum defined in the translations which has a value.
  @Input()
  public enum: string;

  // The property to update and show.
  @Input()
  public property: string;

  @Output()
  optionsEvent = new EventEmitter<Option[]>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._initialOptions =
      this.initialOptions != null && this.initialOptions.length > 0
        ? this.initialOptions
        : [];
    this._options = this.parseInputOptions(this._initialOptions);
    this._value = this.parseInputValues(this._initialValues);
    this._state = this.computeState(this._options, this._value);
    this._initialized = true;
  }

  get initializedInternal(): boolean {
    return this._initialized;
  }

  get buttonGroupStyles(): any {
    return this._buttonGroupStyles;
  }

  @Input()
  set buttonGroupStyles(value: any) {
    this._buttonGroupStyles = value ? value : DefaultButtonGroupStyles;
  }

  get buttonStyles(): any {
    return this._buttonStyles;
  }

  @Input()
  set buttonStyles(value: any) {
    this._buttonStyles = value ? value : DefaultButtonStyles;
  }

  get stateInternal(): any {
    return this._state;
  }
  get options(): Option[] {
    return this._options;
  }

  onKeydown($event) {
    if ($event.key === 'ArrowDown' && !this.autoComplete.overlayVisible) {
      this.autoComplete.handleDropdownClick(0);
    }
  }

  @Input()
  set options(options: Option[]) {
    if (options.length) {
      if (this._initialized) {
        this._options = this.parseInputOptions(options);

        //Only allow enabled values
        const enabledOptions = options.filter(x => !x.disabled);
        let updatedValues: any[] = this._value;
        if (updatedValues) {
          updatedValues = enabledOptions
            .map(option => option.value)
            .filter(value => this._value.includes(value));
        }
        if (!updatedValues || updatedValues.length === 0) {
          updatedValues = this.parseInputValues(this._initialValues);
        }

        //Preserve "All" selection state
        if (this._state && this._state.selectedAllOption) {
          updatedValues = this.parseInputValues(null);
        }

        this.setValueAndNotifyChanges(updatedValues);
        this._state = this.computeState(this._options, this._value);
      } else {
        this._initialOptions = options;
      }
    }
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (this._initialized) {
      this.setValueAndNotifyChanges(this.parseInputValues(value));
      this._state = this.computeState(this._options, this._value);
    } else {
      this._initialValues = value;
    }
  }

  search(event) {
    let query = event.query;
    this.filteredOptions = this.suggestions.filter(
      option =>
        option.text.toUpperCase().indexOf(query.toUpperCase()) > -1 &&
        !this._options.find(o => o.value === option.value)
    );
  }

  private optionSelected(event) {
    this.optionsEvent.emit(this.options);
  }

  removeOption(option: Option) {
    this.options.splice(this.options.indexOf(option), 1);

    if (this._options.length === 0) {
      this.onAllOptionClickInternal();
    }
    this.optionsEvent.emit(this.options);
  }

  computeStylesInternal(...styles): any {
    return Utils.toNgClass(...styles.filter(style => style != null));
  }

  /**
   * Normalizes and copies values
   * This should be used to process all values provided to the value field
   *
   * @param values
   * @returns {any[]}
   */
  private parseInputValues(values: any): any[] {
    if (values == null) {
      return [];
    }
    // Make a copy of the value to avoid side effects
    return values.concat();
  }

  /**
   * Normalizes, copies and makes options sensible defaults.
   * This should be used to process all options provided to the option field
   *
   * @param options to parse and copy
   * @returns {Option[]}
   */
  private parseInputOptions(options: Option[]): Option[] {
    if (options == null) {
      this.throwError('options must not be null or undefined');
    }

    return options.map(
      option =>
        <Option>{
          value: option.value,
          text: option.text ? option.text : option.value,
          analyticsProperties: option.analyticsProperties,
          disabled: option.disabled
        }
    );
  }

  /**
   * This method is called after a state change initiated through user input
   *
   * @param {State} state
   * @param {Option[]} options
   */
  private updateValue(state, options: Option[]): void {
    const values = state.selectedAllOption
      ? undefined
      : options
          .filter(
            option =>
              !option.disabled &&
              (state.selectedAllOption || state.selectedOptions.has(option))
          )
          .map(option => option.value);

    this.setValueAndNotifyChanges(values);
  }

  /**
   * Initializes component state based on the component options and values
   * This method should be called after any externally initiated update to the component options or values
   *
   * @param {Option[]} options
   * @param {any[]} values
   * @returns {State}
   */
  private computeState(options: Option[], values: any[]): State {
    let enabledOptions = options.filter(x => !x.disabled);
    const effectiveOptions = enabledOptions.filter(option =>
      values.includes(option.value)
    );
    const effectivelySelectedAllOption =
      this.suggestions.length === enabledOptions.length ||
      enabledOptions.length == 0;
    return {
      selectedAllOption: effectivelySelectedAllOption,
      selectedOptions: effectivelySelectedAllOption
        ? new Set()
        : new Set(effectiveOptions)
    };
  }

  /**
   * All button click handler
   */
  onAllOptionClickInternal(): void {
    const state = this._state,
      options = this._options;

    state.selectedAllOption = !state.selectedAllOption;

    // Clicking the all button will always result
    // in a deselection of all options buttons
    state.selectedOptions.clear();
    this._options = [];
    this._initialOptions = [];
    this.updateValue(state, options);
    this.optionsEvent.emit(this.options);
  }

  private setValueAndNotifyChanges(value: any) {
    if (!isEqual(this._value, value)) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  private throwError(message: string): void {
    throw new Error(`${this.constructor.name} ${message}`);
  }
}
