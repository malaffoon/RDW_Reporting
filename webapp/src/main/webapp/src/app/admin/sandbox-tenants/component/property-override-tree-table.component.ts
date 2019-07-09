import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forOwn } from 'lodash';
import { TreeNode } from 'primeng/api';
import { TreeTable, TreeTableToggler } from 'primeng/primeng';
import { NotificationService } from '../../../shared/notification/notification.service';
import { DecryptionService } from '../../decryption.service';
import { ConfigurationProperty } from '../model/configuration-property';

@Component({
  selector: 'property-override-tree-table',
  templateUrl: './property-override-tree-table.component.html'
})
export class PropertyOverrideTreeTableComponent implements OnInit {
  @ViewChild('tt') tt: TreeTable;

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

  // Should these be data driven?
  readonly secureFields = ['password', 's3SecretKey'];
  readonly requiredFields = ['password'];
  readonly encryptedFields = ['password'];

  // These fields should be lowercase for consistency with existing usernames and schema names in the database
  readonly lowercaseFields = ['urlParts.database', 'username'];

  showModifiedPropertiesOnly = false;
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
    const toggler = new TreeTableToggler(this.tt);
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

  childrenHaveOverrides(node: TreeNode): boolean {
    if (node.children && node.children.length > 0) {
      const hasOverride = node.children.some(
        child => child.data.value !== child.data.originalValue
      );
      if (hasOverride) {
        return true;
      } else {
        return node.children.some(child => this.childrenHaveOverrides(child));
      }
    }

    return false;
  }

  calculatePadding(override: ConfigurationProperty): string {
    if (!override.encrypted && override.value === override.originalValue) {
      return '0px';
    } else if (
      override.encrypted &&
      override.value !== override.originalValue
    ) {
      return '50px';
    } else {
      return '25px';
    }
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
            children: dataSourcePropertyNodes
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
        expanded: false,
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
            new FormControl(group.value, Validators.required)
          )
        : configPropertiesFormGroup.addControl(
            group.formControlName,
            new FormControl(group.value)
          );
    });
  }
}
