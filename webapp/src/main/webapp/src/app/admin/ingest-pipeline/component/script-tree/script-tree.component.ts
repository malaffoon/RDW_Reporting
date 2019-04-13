import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IngestPipelineScript } from '../../model/script';
import { TreeNode } from 'primeng/api';
import { byNumber, byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { TreeDragDropService } from 'primeng/api';

const byIndex = ordering(byNumber).on(({ index }) => index).compare;
const byName = ordering(byString).on(({ name }) => name).compare;
const RootNodeOptions: Partial<TreeNode> = {
  leaf: false,
  expanded: true,
  draggable: false,
  droppable: true,
  selectable: false
};
const LeafNodeOptions: Partial<TreeNode> = {
  leaf: true,
  expanded: false,
  draggable: true,
  droppable: false,
  selectable: true
};

function toTreeNodes(scripts: IngestPipelineScript[]): TreeNode[] {
  return [
    {
      ...RootNodeOptions,
      label: 'Active Scripts',
      children: scripts
        .filter(({ index }) => index != null)
        .sort(byIndex)
        .map(script => ({
          ...LeafNodeOptions,
          data: script,
          label: script.name
        }))
    },
    {
      ...RootNodeOptions,
      label: 'Inactive Scripts',
      children: scripts
        .filter(({ index }) => index == null)
        .sort(byName)
        .map(script => ({
          ...LeafNodeOptions,
          data: script,
          label: script.name
        }))
    }
  ];
}

@Component({
  selector: 'script-tree',
  templateUrl: './script-tree.component.html',
  styleUrls: ['./script-tree.component.less'],
  providers: [TreeDragDropService]
})
export class ScriptTreeComponent {
  @Output()
  scriptSelected: EventEmitter<IngestPipelineScript> = new EventEmitter();

  _scripts: IngestPipelineScript[];
  _nodes: TreeNode[];
  _selectedNode: TreeNode;

  @Input()
  set scripts(values: IngestPipelineScript[]) {
    const scripts = values.slice();
    this._scripts = scripts;
    this._nodes = toTreeNodes(scripts);
  }

  @Input()
  set selectedScript(value: IngestPipelineScript) {
    this._selectedNode = [
      ...this._nodes[0].children,
      ...this._nodes[1].children
    ].find(node => node.data === value);
  }

  onNodeDrop(event: any): void {
    // TODO anything?
  }
}
