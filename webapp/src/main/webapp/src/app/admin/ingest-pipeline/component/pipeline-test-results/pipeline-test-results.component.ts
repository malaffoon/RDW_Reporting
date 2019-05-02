import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe
} from '@angular/core';
import { Pipeline, PipelineTest } from '../../model/pipeline';
import { first } from 'rxjs/operators';
import { Item } from '../pipeline-explorer/pipeline-explorer.component';
import { equalDate } from '../../../../shared/support/support';

function findFirstFailedOrFirst(tests: PipelineTest[]): PipelineTest {
  const firstFailed = tests.find(({ result: { passed } }) => !passed);
  return firstFailed != null ? firstFailed : tests[0];
}

@Component({
  selector: 'pipeline-test-results',
  templateUrl: './pipeline-test-results.component.html',
  styleUrls: ['./pipeline-test-results.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestResultsComponent {
  @Input()
  pipeline: Pipeline;

  @Output()
  closeButtonClick: EventEmitter<MouseEvent> = new EventEmitter();

  _tests: PipelineTest[];
  _selectedTest: PipelineTest;

  @Input()
  set tests(values: PipelineTest[]) {
    this._tests = values.slice();
    // TODO scroll to test at initialization
    this._selectedTest = findFirstFailedOrFirst(values);
  }

  onTestClick(test: PipelineTest, scrollElement: HTMLElement): void {
    this._selectedTest = test;
    scrollElement.scrollIntoView({
      block: 'nearest'
    });
  }

  showTime(test: PipelineTest): boolean {
    return (
      this._tests.find(
        otherTest =>
          test !== otherTest && equalDate(test.createdOn, otherTest.createdOn)
      ) != null
    );
  }
}
