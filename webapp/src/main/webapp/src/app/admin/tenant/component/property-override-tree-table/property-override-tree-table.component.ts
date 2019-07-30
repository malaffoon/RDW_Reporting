import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidatorFn
} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { TreeTable, TreeTableToggler } from 'primeng/primeng';
import { showErrors } from '../../../../shared/form/forms';
import { ConfigurationProperty } from '../../model/property';
import {
  configurationFormFields,
  fieldInputType,
  fieldValidators,
  isModified
} from '../../model/fields';
import { TenantType } from '../../model/tenant-type';

export function configurationsFormGroup(
  type: TenantType,
  defaults: any,
  overrides: any = {},
  validators: ValidatorFn | ValidatorFn[] = []
): FormGroup {
  overrides = overrides || {};
  return new FormGroup(
    Object.keys(configurationFormFields(type)).reduce((controlsByName, key) => {
      // don't populate form control values for inputs
      // show a placeholder instead to indicate that entering nothing will
      // result in that default value
      const value =
        fieldInputType(key) !== 'input'
          ? overrides[key] || defaults[key]
          : overrides[key];

      controlsByName[key] = new FormControl(value, fieldValidators(key));
      return controlsByName;
    }, {}),
    validators
  );
}

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
    if (child.key != null) {
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
  readonly rowTrackBy = rowTrackBy;

  @ViewChild('table')
  table: TreeTable;

  @Input()
  defaults: any;

  @Input()
  tree: TreeNode[] = [];

  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  modified(property: ConfigurationProperty): boolean {
    return isModified(
      property.key,
      this.formGroup.value[property.key],
      property.originalValue
    );
  }

  showPasswordToggle(property: ConfigurationProperty): boolean {
    const value = this.formGroup.value[property.key];
    return (
      property.configuration.dataType === 'password' &&
      value != null &&
      value !== ''
    );
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

  onResetButtonClick(property: ConfigurationProperty): void {
    this.formGroup.patchValue({
      [property.key]: property.originalValue
    });
  }
}
