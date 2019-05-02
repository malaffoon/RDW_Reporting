import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { InputType, PipelineTest } from '../../model/pipeline';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

function maxScrollTop(editor: any): number {
  const { renderer } = editor;
  return (
    renderer.layerConfig.maxHeight -
    renderer.$size.scrollerHeight +
    renderer.scrollMargin.bottom
  );
}

function bindScrollTop(editorA: any, editorB: any): void {
  editorA.getSession().on('changeScrollTop', scrollTop => {
    if (
      scrollTop >= 0 &&
      scrollTop <= maxScrollTop(editorB) &&
      editorB.getSession().getScrollTop() !== scrollTop
    ) {
      editorB.getSession().setScrollTop(scrollTop);
    }
  });
}

@Component({
  selector: 'pipeline-test-form',
  templateUrl: './pipeline-test-form.component.html',
  styleUrls: ['./pipeline-test-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestFormComponent {
  @Input()
  inputType: InputType;

  @Input()
  test: PipelineTest;

  @Output()
  testChange: EventEmitter<PipelineTest> = new EventEmitter();

  @ViewChild('input')
  input: CodeEditorComponent;

  @ViewChild('output')
  output: CodeEditorComponent;

  ngAfterViewInit(): void {
    const { _editor: input } = this.input;
    const { _editor: output } = this.output;
    bindScrollTop(input, output);
    bindScrollTop(output, input);
  }
}
