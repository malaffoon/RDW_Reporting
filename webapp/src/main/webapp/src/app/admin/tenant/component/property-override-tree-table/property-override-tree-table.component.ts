import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { TreeTable, TreeTableToggler } from 'primeng/primeng';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { OldConfigProp } from '../../model/old-config-prop';
import { showErrors } from '../../../../shared/form/forms';
import { DecryptionService } from '../../service/decryption.service';
import {
  propertyValidators,
  toConfigurationProperty,
  toProperty
} from '../../model/properties';
import { ConfigurationProperty } from '../../model/property';
import { unflatten } from '../../../../shared/support/support';

export function configurationsFormGroup(
  defaults: any,
  overrides: any = {},
  validators: ValidatorFn | ValidatorFn[] = []
): FormGroup {
  return new FormGroup(
    Object.entries(defaults).reduce((controlsByName, [key, defaultValue]) => {
      const overrideValue = overrides[key];
      const value = overrideValue != null ? overrideValue : defaultValue;
      controlsByName[key] = new FormControl(value, propertyValidators(key));
      return controlsByName;
    }, {}),
    validators
  );
}

function rowTrackBy(index: number, { node }: any): string {
  return node.key;
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
// forOwn(this.configurationProperties, (configGroup, groupKey) => {
//   const childrenNodes: TreeNode[] = [];
//   const groupReadonly = this.readonlyGroups.some(x => x === groupKey);
//   // For each configuration group, create a root-level node
//
//   if (groupKey === 'datasources') {
//     forOwn(configGroup, (dataSourceProperties, dataSourceKey) => {
//       const dataSourcePropertyNodes: TreeNode[] = [];
//       this.mapLeafNodes(
//         dataSourceProperties,
//         dataSourcePropertyNodes,
//         groupReadonly
//       );
//
//       childrenNodes.push({
//         data: {
//           key: dataSourceKey
//         },
//         children: dataSourcePropertyNodes,
//         expanded: this.expanded
//       });
//     });
//   } else {
//     this.mapLeafNodes(configGroup, childrenNodes, groupReadonly);
//   }
//
//   const groupNode = <TreeNode>{
//     data: {
//       key: groupKey,
//       groupNode: true
//     },
//     children: childrenNodes,
//     expanded: this.expanded,
//     leaf: false
//   };
//   groupNodes.push(groupNode);
// });

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
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => PropertyOverrideTableComponent),
    //   multi: true
    // }
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

  constructor(
    private controlContainer: ControlContainer,
    private decryptionService: DecryptionService,
    private notificationService: NotificationService
  ) {}

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

  //
  // updateOverride(override: ConfigurationProperty): void {
  //   const formGroup = <FormGroup>this.form.controls[this.propertiesArrayName];
  //   const formControl = formGroup.controls[override.formControlName];
  //   const newVal = override.lowercase
  //     ? formControl.value.toLowerCase()
  //     : formControl.value;
  //   this.setPropertyValue(override, newVal);
  // }

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

  onDecryptButtonClick(property: ConfigurationProperty): void {
    const {
      value: { [property.key]: value }
    } = this.formGroup;
    this.decryptionService.decrypt(value).subscribe(
      decrypted => {
        this.formGroup.patchValue({
          [property.key]: decrypted
        });
      },
      () => this.notificationService.error({ id: 'decryption-service.error' })
    );
  }

  private setPropertyValue(override: OldConfigProp, newVal: string) {
    // let configurationProperties = <ConfigurationProperty[]>(
    //   this.configurationProperties[override.group]
    // );
    //
    // if (!configurationProperties) {
    //   // If we couldn't find the group within the top-level property groups, lets peek at datasources...
    //   const datasources = this.configurationProperties['datasources'];
    //   configurationProperties = <ConfigurationProperty[]>(
    //     datasources[override.group]
    //   );
    // }
    //
    // const configurationProperty = configurationProperties.find(
    //   property => property.key === override.key
    // );
    // configurationProperty.value = newVal;
    // override.value = newVal;
    // this.propertyValueChanged.emit(override);
  }

  private createConfigurationPropertyTree(): void {
    const groupNodes: TreeNode[] = [];

    // forOwn(this.configurationProperties, (configGroup, groupKey) => {
    //   const childrenNodes: TreeNode[] = [];
    //   const groupReadonly = this.readonlyGroups.some(x => x === groupKey);
    //   // For each configuration group, create a root-level node
    //
    //   if (groupKey === 'datasources') {
    //     forOwn(configGroup, (dataSourceProperties, dataSourceKey) => {
    //       const dataSourcePropertyNodes: TreeNode[] = [];
    //       this.mapLeafNodes(
    //         dataSourceProperties,
    //         dataSourcePropertyNodes,
    //         groupReadonly
    //       );
    //
    //       childrenNodes.push({
    //         data: {
    //           key: dataSourceKey
    //         },
    //         children: dataSourcePropertyNodes,
    //         expanded: this.expanded
    //       });
    //     });
    //   } else {
    //     this.mapLeafNodes(configGroup, childrenNodes, groupReadonly);
    //   }
    //
    //   const groupNode = <TreeNode>{
    //     data: {
    //       key: groupKey,
    //       groupNode: true
    //     },
    //     children: childrenNodes,
    //     expanded: this.expanded,
    //     leaf: false
    //   };
    //   groupNodes.push(groupNode);
    // });

    this.tree = [...groupNodes];
  }

  private mapLeafNodes(
    configGroup: OldConfigProp[],
    childrenNodes: TreeNode[],
    readonly: boolean
  ): void {
    // const configPropertiesFormGroup = <FormGroup>(
    //   this.form.controls[this.propertiesArrayName]
    // );
    //
    // configGroup.forEach(group => {
    //   const encrypted =
    //     group.value &&
    //     typeof group.value === 'string' &&
    //     group.value.startsWith('{cipher}') &&
    //     this.encryptedFields.some(x => x === group.key);
    //
    //   // TODO sometimes keys have "configurationProperties ->" in the key... is this a race condition?
    //
    //   // TODO: Move these to the mapper.
    //   group.encrypted = encrypted;
    //   group.readonly = readonly || this.readonly;
    //   group.secure = this.secureFields.includes(group.key);
    //   group.required = this.requiredFields.includes(group.key);
    //   group.lowercase = this.lowercaseFields.includes(group.key);
    //
    //   childrenNodes.push({
    //     data: group, // assign object as a reference so other fields can trigger changes
    //     expanded: false,
    //     leaf: true
    //   });
    //
    //   group.key.includes('password')
    //     ? configPropertiesFormGroup.addControl(
    //         group.formControlName,
    //         new FormControl(group.value, passwordValidators())
    //       )
    //     : configPropertiesFormGroup.addControl(
    //         group.formControlName,
    //         new FormControl(group.value)
    //       );
    // });
  }
}
