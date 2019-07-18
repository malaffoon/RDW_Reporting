import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { forOwn } from 'lodash';
import { TreeNode } from 'primeng/api';
import { TreeTable, TreeTableToggler } from 'primeng/primeng';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { DecryptionService } from '../../../decryption.service';
import { ConfigurationProperty } from '../../model/configuration-property';
import { mod } from 'ngx-bootstrap/chronos/utils';

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

@Component({
  selector: 'property-override-tree-table',
  templateUrl: './property-override-tree-table.component.html',
  styleUrls: ['./property-override-tree-table.component.less']
})
export class PropertyOverrideTreeTableComponent implements OnInit {
  readonly hasModifiedDescendant = hasModifiedDescendant;
  readonly hasRequiredDescendant = hasRequiredDescendant;
  readonly rowTrackBy = rowTrackBy;

  @ViewChild('table') table: TreeTable;

  _configurationProperties: any;

  get configurationProperties(): any {
    return this._configurationProperties;
  }

  @Input()
  set configurationProperties(properties: any) {
    this._configurationProperties = properties;
    if (this.form) {
      this.createConfigurationPropertyTree();
    }
  }

  @Input()
  propertiesArrayName: string;

  @Input()
  form: FormGroup;

  @Input()
  readonly = true;

  @Input()
  readonlyGroups: string[] = [];

  @Output()
  propertyValueChanged: EventEmitter<
    ConfigurationProperty
  > = new EventEmitter();

  // Should these be data driven?
  readonly secureFields = ['password', 's3SecretKey'];
  readonly requiredFields = ['password'];
  readonly encryptedFields = ['password'];

  // These fields should be lowercase for consistency with existing usernames and schema names in the database
  readonly lowercaseFields = ['urlParts.database', 'username'];

  @Input()
  required = false;

  @Input()
  modified = false;

  @Input()
  expanded = true;

  configurationPropertiesTreeNodes: TreeNode[] = [];

  constructor(
    private decryptionService: DecryptionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createConfigurationPropertyTree();
  }

  updateOverride(override: ConfigurationProperty): void {
    const formGroup = <FormGroup>this.form.controls[this.propertiesArrayName];
    const formControl = formGroup.controls[override.formControlName];
    const newVal = override.lowercase
      ? formControl.value.toLowerCase()
      : formControl.value;
    this.setPropertyValue(override, newVal);
  }

  expandOrCollapse(node: any, event): void {
    // Manaully invoking the TreeTableToggler, as it seems there's more to it than just
    // toggling the boolean value of expanded.
    // https://github.com/primefaces/primeng/blob/6.0.0-rc.1/src/app/components/treetable/treetable.ts#L2266
    const toggler = new TreeTableToggler(this.table);
    toggler.rowNode = node;
    toggler.onClick(event);
  }

  resetClicked(override: ConfigurationProperty): void {
    this.setPropertyValue(override, override.originalValue);
  }

  decryptClicked(override: ConfigurationProperty): void {
    this.decryptionService.decrypt(override.value).subscribe(
      password => {
        override.value = password;
        override.encrypted = false;
      },
      error =>
        this.notificationService.error({ id: 'tenant-config.errors.decrypt' })
    );
  }

  private setPropertyValue(override: ConfigurationProperty, newVal: string) {
    let configurationProperties = <ConfigurationProperty[]>(
      this._configurationProperties[override.group]
    );

    if (!configurationProperties) {
      // If we couldn't find the group within the top-level property groups, lets peek at datasources...
      const datasources = this._configurationProperties['datasources'];
      configurationProperties = <ConfigurationProperty[]>(
        datasources[override.group]
      );
    }

    const configurationProperty = configurationProperties.find(
      property => property.key === override.key
    );
    configurationProperty.value = newVal;
    override.value = newVal;
    this.propertyValueChanged.emit(override);
  }

  private createConfigurationPropertyTree(): void {
    const groupNodes: TreeNode[] = [];

    forOwn(this._configurationProperties, (configGroup, groupKey) => {
      const childrenNodes: TreeNode[] = [];
      const groupReadonly = this.readonlyGroups.some(x => x === groupKey);
      // For each configuration group, create a root-level node

      if (groupKey === 'datasources') {
        forOwn(configGroup, (dataSourceProperties, dataSourceKey) => {
          const dataSourcePropertyNodes: TreeNode[] = [];
          this.mapLeafNodes(
            dataSourceProperties,
            dataSourcePropertyNodes,
            groupReadonly
          );

          childrenNodes.push({
            data: {
              key: dataSourceKey
            },
            children: dataSourcePropertyNodes,
            expanded: this.expanded
          });
        });
      } else {
        this.mapLeafNodes(configGroup, childrenNodes, groupReadonly);
      }

      const groupNode = <TreeNode>{
        data: {
          key: groupKey,
          groupNode: true
        },
        children: childrenNodes,
        expanded: this.expanded,
        leaf: false
      };
      groupNodes.push(groupNode);
    });

    this.configurationPropertiesTreeNodes = [...groupNodes];
  }

  private mapLeafNodes(
    configGroup: ConfigurationProperty[],
    childrenNodes: TreeNode[],
    readonly: boolean
  ): void {
    const configPropertiesFormGroup = <FormGroup>(
      this.form.controls[this.propertiesArrayName]
    );

    configGroup.forEach(group => {
      const encrypted =
        group.value &&
        typeof group.value === 'string' &&
        group.value.startsWith('{cipher}') &&
        this.encryptedFields.some(x => x === group.key);

      // TODO: Move these to the mapper.
      group.encrypted = encrypted;
      group.readonly = readonly || this.readonly;
      group.secure = this.secureFields.some(x => x === group.key);
      group.required = this.requiredFields.some(x => x === group.key);
      group.lowercase = this.lowercaseFields.some(x => x === group.key);

      childrenNodes.push({
        data: group, // assign object as a reference so other fields can trigger changes
        expanded: false,
        leaf: true
      });

      group.key.indexOf('password') > -1
        ? configPropertiesFormGroup.addControl(
            group.formControlName,
            new FormControl(group.value, passwordValidators())
          )
        : configPropertiesFormGroup.addControl(
            group.formControlName,
            new FormControl(group.value)
          );
    });
  }
}
