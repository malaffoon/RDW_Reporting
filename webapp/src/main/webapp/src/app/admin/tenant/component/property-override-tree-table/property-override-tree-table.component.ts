import {
  Component,
  forwardRef,
  Injector,
  Input,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { TreeTable, TreeTableToggler } from 'primeng/primeng';
import { showErrors } from '../../../../shared/form/forms';
import { formFieldModified } from '../../model/form/form-fields';
import { Property } from '../../model/property';
import { isEqual } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Option } from '../../model/form/option';
import { ConstraintType } from '../../model/form/constraint-type';
import { share } from 'rxjs/operators';

function addTreeNodesRecursively(
  nodes: TreeNode[],
  value: any, // first value must be object
  parentPath: string,
  expanded: boolean,
  depth: number = 0
): void {
  for (let key in value) {
    if (!value.hasOwnProperty(key)) {
      continue;
    }

    const child = value[key];
    const path = parentPath.length > 0 ? `${parentPath}.${key}` : key;

    // configuration property
    if (child.configuration != null) {
      nodes.push({
        leaf: true,
        key: path, // shortcut
        data: {
          segment: key,
          ...child
        },
        expanded
      });
    } else if (typeof child === 'object' && child != null) {
      const parent = {
        key: path,
        data: {
          segment: key,
          depth
        },
        expanded,
        children: []
      };
      addTreeNodesRecursively(
        parent.children,
        child,
        path,
        expanded,
        depth + 1
      );
      nodes.push(parent);
    }
  }
}

/**
 * Creates a ng-prime tree table data structure from the given json object
 *
 * @param value The object to convert
 * @param expanded Set to true if you want the tree nodes expanded
 */
export function toTreeNodes(value: any, expanded: boolean = false): TreeNode[] {
  const nodes = [];
  addTreeNodesRecursively(nodes, value, '', expanded);
  return nodes;
}

function rowTrackBy(index: number, { node }: any): string {
  return node.key;
}

@Component({
  selector: 'property-override-tree-table',
  templateUrl: './property-override-tree-table.component.html',
  styleUrls: ['./property-override-tree-table.component.less'],
  // disabling this as external changes can now trigger changes within this form
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PropertyOverrideTreeTableComponent),
      multi: true
    }
  ]
})
export class PropertyOverrideTreeTableComponent
  implements ControlValueAccessor {
  readonly showErrors = showErrors;
  readonly compareWith = isEqual;
  readonly rowTrackBy = rowTrackBy;

  @ViewChild('table')
  table: TreeTable;

  @Input()
  defaults: any;

  @Input()
  tree: TreeNode[] = [];

  optionsByPropertyName: { [name: string]: Observable<Option<any>[]> } = {};

  constructor(
    private controlContainer: ControlContainer,
    private translateService: TranslateService,
    private injector: Injector
  ) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  modified(property: Property): boolean {
    return formFieldModified(
      property.configuration.dataType.inputType,
      this.formGroup.value[property.configuration.name],
      property.originalValue
    );
  }

  showPasswordToggle(property: Property): boolean {
    const value = this.formGroup.value[property.configuration.name];
    return (
      property.configuration.dataType.masked && value != null && value !== ''
    );
  }

  hasConstraint(property: Property, constraint: ConstraintType): boolean {
    const { constraints } = property.configuration.dataType;
    return constraints != null && constraints.includes(constraint);
  }

  readonlyValue(property: Property): any {
    const { name } = property.configuration;
    // needs to be raw value because these fields will be disabled
    // and disabled field values do not appear in formGroup.value
    const value = this.formGroup.getRawValue()[name];
    if (value != null) {
      return value;
    }
    const defaultValue = this.defaults[name]; // property.originalValue?
    if (defaultValue != null) {
      return defaultValue;
    }
    // TODO mask values?
    return '';
  }

  getOptions(property: Property): Observable<Option<any>[]> {
    const {
      configuration: { name, dataType }
    } = property;
    const options = this.optionsByPropertyName[name];
    if (options != null) {
      return options;
    }
    return (this.optionsByPropertyName[name] = dataType
      .options({
        translateService: this.translateService,
        injector: this.injector
      })
      .pipe(share()));
  }

  getErrors(property: Property): string[] {
    const { errors } = this.formGroup.controls[property.configuration.name];
    return Object.keys(errors);
  }

  // control value accessor implementation:

  public onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value) {
      this.formGroup.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  // internals

  onRowClick(node: any, event: Event): void {
    // Manaully invoking the TreeTableToggler, as it seems there's more to it than just
    // toggling the boolean value of expanded.
    // https://github.com/primefaces/primeng/blob/6.0.0-rc.1/src/app/components/treetable/treetable.ts#L2266
    const toggler = new TreeTableToggler(this.table);
    toggler.rowNode = node;
    toggler.onClick(event);
  }

  onResetButtonClick(property: Property): void {
    this.formGroup.patchValue({
      [property.configuration.name]: property.originalValue
    });
  }
}
