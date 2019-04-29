import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

declare var AceDiff;

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
    if (
      this._left == null ||
      this._right == null ||
      this._language == null ||
      !this._initialized
    ) {
      return;
    }
    this._view = new AceDiff({
      element: this.elementReference.nativeElement,
      theme: 'ace/theme/xcode',
      mode: `ace/mode/${this._language}`,
      showConnectors: false,
      // diffGranularity: 'specific',
      left: {
        content: this._left,
        editable: false,
        copyLinkEnabled: false
      },
      right: {
        content: this._right,
        editable: false,
        copyLinkEnabled: false
      }
    });
  }
}
