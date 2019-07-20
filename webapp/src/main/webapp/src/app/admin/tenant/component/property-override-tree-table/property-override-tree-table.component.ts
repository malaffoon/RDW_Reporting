import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { TreeTable, TreeTableToggler } from 'primeng/primeng';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { OldConfigProp } from '../../model/old-config-prop';
import { showErrors } from '../../../../shared/form/forms';
import { DecryptionService } from '../../service/decryption.service';

export function configurationsFormGroup(
  defaults: any,
  overrides: any = {},
  validators: ValidatorFn | ValidatorFn[] = []
): FormGroup {
  return new FormGroup(
    Object.entries(defaults).reduce((controlsByName, [key, defaultValue]) => {
      const overrideValue = overrides[key];
      const value = overrideValue != null ? overrideValue : defaultValue;

      // TODO apply metadata
      const controlValidators = [];

      controlsByName[key] = new FormControl(value, controlValidators);

      return controlsByName;
    }, {}),
    validators
  );
}

function passwordValidators(): ValidatorFn[] {
  return [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(64),
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd].{8,}')
  ];
}

function hasModifiedDescendant(node: TreeNode): boolean {
  const { children } = node;
  if (children && children.length > 0) {
    const modified = children.some(
      ({ data }) => data.value !== data.originalValue
    );
    if (modified) {
      return true;
    }
    return children.some(child => hasModifiedDescendant(child));
  }
  return false;
}

function hasRequiredDescendant(node: TreeNode): boolean {
  const { children } = node;
  if (children && children.length > 0) {
    const required = children.some(({ data }) => data.required);
    if (required) {
      return true;
    }
    return children.some(child => hasRequiredDescendant(child));
  }
  return false;
}

function rowTrackBy(index: number, { node }: any) {
  return (node.leaf ? 'leaf.' : 'parent.') + node.data.key;
}

function createTreeRecurse(
  nodes: TreeNode[],
  defaults: any,
  formGroup: FormGroup
): void {
  // TODO
}

function createTree(defaults: any, formGroup: FormGroup): TreeNode[] {
  const nodes = [];
  createTreeRecurse(nodes, defaults, formGroup);
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
  styleUrls: ['./property-override-tree-table.component.less']
})
export class PropertyOverrideTreeTableComponent implements OnChanges {
  readonly showErrors = showErrors;
  readonly hasModifiedDescendant = hasModifiedDescendant;
  readonly hasRequiredDescendant = hasRequiredDescendant;
  readonly rowTrackBy = rowTrackBy;

  @ViewChild('table')
  table: TreeTable;

  @Input()
  defaults: any;

  @Input()
  readonly = true;

  @Input()
  readonlyGroups: string[] = [];

  @Output()
  propertyValueChanged: EventEmitter<OldConfigProp> = new EventEmitter();

  @Input()
  required = false;

  @Input()
  modified = false;

  @Input()
  expanded = true;

  formGroup: FormGroup;
  tree: TreeNode[] = [];

  constructor(
    private decryptionService: DecryptionService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { defaults } = this;
    if (defaults != null) {
      this.formGroup = configurationsFormGroup(defaults);
      this.tree = createTree(defaults, this.formGroup);
    }
  }

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

  onResetButtonClick(override: OldConfigProp): void {
    // this.setPropertyValue(override, override.originalValue);
  }

  onDecryptButtonClick(override: OldConfigProp): void {
    // this.decryptionService.decrypt(override.value).subscribe(
    //   password => {
    //     override.value = password;
    //     override.encrypted = false;
    //   },
    //   error =>
    //     this.notificationService.error({ id: 'decryption-service.error' })
    // );
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
