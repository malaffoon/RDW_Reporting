import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { FormControl, FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { SandboxConfiguration } from '../model/sandbox-configuration';
import { forOwn, cloneDeep } from 'lodash';
import { TenantConfiguration } from '../model/tenant-configuration';

@Component({
  selector: 'property-override-tree-table',
  templateUrl: './property-override-tree-table.component.html'
})
export class PropertyOverrideTreeTableComponent implements OnInit {
  @Input()
  sandboxOrTenant: SandboxConfiguration | TenantConfiguration;
  @Input()
  propertiesArrayName: string;
  @Input()
  form: FormGroup;

  showModifiedPropertiesOnly = false;
  configurationPropertiesTreeNodes: TreeNode[] = [];

  constructor() {}

  ngOnInit(): void {
    this.createConfigurationPropertyTree();
  }

  updatePropertiesFilter(): void {
    //TODO: Implement this - navigate the tree and filter out nodes that do not have modifications
  }

  updateOverride(override: ConfigurationProperty): void {
    const formGroup = <FormGroup>this.form.controls[this.propertiesArrayName];
    const formControl = formGroup.controls[override.formControlName];
    const newVal = formControl.value;
    override.value = newVal;
  }

  expandOrCollapse(node: TreeNode): void {
    node.expanded = !node.expanded;
    // Change detection is not triggered unless the TreeNode array is replaced
    this.configurationPropertiesTreeNodes = cloneDeep(
      this.configurationPropertiesTreeNodes
    );
  }

  resetClicked(override: ConfigurationProperty): void {
    override.value = override.originalValue;
    this.updatePropertiesFilter();
  }

  private createConfigurationPropertyTree(): void {
    forOwn(
      this.sandboxOrTenant.configurationProperties,
      (configGroup, groupKey) => {
        const childrenNodes: TreeNode[] = [];
        // For each configuration group, create a root-level node

        if (groupKey === 'datasources') {
          forOwn(configGroup, (dataSourceProperties, dataSourceKey) => {
            let dataSourcePropertyNodes: TreeNode[] = [];
            this.mapLeafNodes(
              dataSourceProperties,
              dataSourceKey,
              dataSourcePropertyNodes
            );

            childrenNodes.push({
              data: {
                key: dataSourceKey
              },
              children: dataSourcePropertyNodes
            });
          });
        } else {
          this.mapLeafNodes(configGroup, groupKey, childrenNodes);
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
        this.configurationPropertiesTreeNodes.push(groupNode);
      }
    );
  }

  private mapLeafNodes(configGroup, groupKey, childrenNodes: TreeNode[]): void {
    const configPropertiesFormGroup = <FormGroup>(
      this.form.controls[this.propertiesArrayName]
    );

    configGroup.forEach(group => {
      const formControlKey = `${groupKey}-${group.key}`;
      childrenNodes.push({
        data: {
          key: group.key,
          value: group.value,
          originalValue: group.originalValue,
          formControlName: formControlKey
        },
        expanded: false,
        leaf: true
      });

      configPropertiesFormGroup.addControl(
        formControlKey,
        new FormControl(group.value)
      );
    });
  }
}
