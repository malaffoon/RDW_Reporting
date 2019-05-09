import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Pipeline, PipelineTestRun } from '../../model/pipeline';
import { equalDate } from '../../../../shared/support/support';

function findFirstFailedOrFirst(tests: PipelineTestRun[]): PipelineTestRun {
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

  _testRuns: PipelineTestRun[];
  _selectedTestRun: PipelineTestRun;

  @Input()
  set testRuns(values: PipelineTestRun[]) {
    this._testRuns = values.slice();
    // TODO scroll to test at initialization
    this._selectedTestRun = findFirstFailedOrFirst(values);
  }

  onTestRunClick(run: PipelineTestRun, scrollElement: HTMLElement): void {
    this._selectedTestRun = run;
    scrollElement.scrollIntoView({
      block: 'nearest'
    });
  }

  showTime(test: PipelineTestRun): boolean {
    return (
      this._testRuns.find(
        otherTest =>
          test !== otherTest &&
          equalDate(test.test.createdOn, otherTest.test.createdOn)
      ) != null
    );
  }
}
