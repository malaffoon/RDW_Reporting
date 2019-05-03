import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

declare var AceDiff;

function lineCount(value: string): number {
  return value.split(/\r\n|\r|\n/).length;
}

function padLines(value: string, count: number): string {
  return value + '\n'.repeat(count);
}

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
  selector: 'code-difference',
  templateUrl: './code-difference.component.html',
  styleUrls: ['./code-difference.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeDifferenceComponent implements OnInit {
  @ViewChild('element')
  elementReference: ElementRef;

  _view: any;
  _left: string;
  _right: string;
  _language: string;
  _initialized: boolean;

  @Input()
  set left(value: string) {
    this._left = value;
    this.initialize();
  }

  @Input()
  set right(value: string) {
    this._right = value;
    this.initialize();
  }

  @Input()
  set language(value: string) {
    this._language = value;
    this.initialize();
  }

  ngOnInit(): void {
    this._initialized = true;
    this.initialize();
  }

  initialize(): void {
    const {
      _left: left,
      _right: right,
      _language: language,
      _initialized: initialized,
      elementReference
    } = this;

    if (left == null || right == null || language == null || !initialized) {
      return;
    }

    const leftLineCount = lineCount(left);
    const rightLineCount = lineCount(right);
    let paddedLeft = left;
    let paddedRight = right;

    if (leftLineCount < rightLineCount) {
      paddedLeft = padLines(left, rightLineCount - leftLineCount);
    } else {
      paddedRight = padLines(right, leftLineCount - rightLineCount);
    }

    const aceDiff = new AceDiff({
      element: elementReference.nativeElement,
      theme: 'ace/theme/xcode',
      mode: `ace/mode/${language}`,
      showConnectors: false,
      left: {
        content: paddedLeft,
        editable: false,
        copyLinkEnabled: false
      },
      right: {
        content: paddedRight,
        editable: false,
        copyLinkEnabled: false
      }
    });

    const leftEditor = aceDiff.getEditors().left;
    const rightEditor = aceDiff.getEditors().right;
    bindScrollTop(leftEditor, rightEditor);
    bindScrollTop(rightEditor, leftEditor);

    this._view = aceDiff;
  }
}
