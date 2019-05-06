import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pipeline, PipelineTest } from '../../model/pipeline';
import {
  equalDate,
  isBlank,
  isNullOrBlank
} from '../../../../shared/support/support';
import { isValidPipelineTest } from '../../model/pipelines';

export type ItemType = 'Script' | 'Test';

export interface Item<T = any> {
  type: ItemType;
  value: T;
  lastSavedValue: T;
  changed?: boolean;
}

@Component({
  selector: 'pipeline-explorer',
  templateUrl: './pipeline-explorer.component.html',
  styleUrls: ['./pipeline-explorer.component.less']
})
export class PipelineExplorerComponent {
  readonly isValidPipelineTest = isValidPipelineTest;

  @Input()
  selectedItem: Item;

  @Output()
  itemSelected: EventEmitter<Item> = new EventEmitter();

  @Output()
  createTestButtonClick: EventEmitter<void> = new EventEmitter();

  @Output()
  deleteTestButtonClick: EventEmitter<Item<PipelineTest>> = new EventEmitter();

  _scriptItems: Item<Pipeline>[] = [];
  _testItems: Item<PipelineTest>[] = [];

  @Input()
  set items(values: Item[]) {
    this._scriptItems = values.filter(({ type }) => type === 'Script');
    this._testItems = values.filter(({ type }) => type === 'Test');
  }

  onItemClick(item: Item, element: HTMLElement): void {
    this.itemSelected.emit(item);
    element.scrollIntoView({
      block: 'nearest'
    });
  }

  showTime(item: Item<PipelineTest>): boolean {
    return (
      this._testItems.find(
        otherItem =>
          item !== otherItem &&
          equalDate(item.value.createdOn, otherItem.value.createdOn)
      ) != null
    );
  }
}
