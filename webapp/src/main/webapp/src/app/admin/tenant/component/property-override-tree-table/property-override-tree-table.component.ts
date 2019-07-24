import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
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
import { fieldValidators } from '../../model/fields';

export function configurationsFormGroup(
  defaults: any,
  overrides: any = {},
  validators: ValidatorFn | ValidatorFn[] = []
): FormGroup {
  return new FormGroup(
    Object.entries(defaults).reduce((controlsByName, [key, defaultValue]) => {
      const overrideValue = overrides[key];
      const value = overrideValue != null ? overrideValue : defaultValue;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonlyGroups: string[] = [];

  @Input()
  readonly = true;

  @Input()
  tree: TreeNode[] = [];

  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
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
      [property.key]: property.defaultValue
    });
  }
}
