import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { WindowRefService } from "../core/window-ref.service";
import { Utils } from "../support/support";

const PositionFixed = 'fixed';

/**
 * Makes a decorated element stick to the top when the user scrolls past its vertical position
 * Also, the elements original page x-position is maintained when scrolling horizontally
 */
@Directive({
  selector: '[sticky]'
})
export class StickyDirective {

  private _window: Window;
  private _initialPosition: string;
  private _initialAbsoluteOffset: Point;
  private _initialOffset: Point;
  private _marginTop: number = 0;

  constructor(private _element: ElementRef,
              windowReferenceService: WindowRefService) {
    this._window = windowReferenceService.nativeWindow;
  }

  @Input()
  set marginTop(value: number) {
    this._marginTop = Utils.integerValueOf(value);
  }

  ngAfterViewInit(): void {
    Utils.setImmediate(() => {
      const nativeElement = this._element.nativeElement;
      this._initialPosition = nativeElement.style.position;
      this._initialAbsoluteOffset = Utils.getAbsoluteOffset(nativeElement);
      this._initialOffset = {
        x: nativeElement.offsetLeft,
        y: nativeElement.offsetTop
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    const windowX = this._window.pageXOffset,
      windowY = this._window.pageYOffset,
      elementX = this._initialAbsoluteOffset.x,
      elementY = this._initialAbsoluteOffset.y - this._marginTop,
      pixelsOf = Utils.formatPixels,
      style = this._element.nativeElement.style;

    if (windowY > elementY) {

      // apply stickyness by adding position: fixed and manually correcting the top/left styles
      style.position = PositionFixed;
      style.top = pixelsOf(this._marginTop);

      // correct the position: fixed element's left offset
      // without this the element will move along the x-axis when the page scrolls horizontally
      style.left = pixelsOf(elementX - windowX);

    } else {

      // set position back to original settings
      style.position = this._initialPosition;
      style.top = pixelsOf(this._initialOffset.y);
      style.left = pixelsOf(this._initialOffset.x);

    }

  }

}

interface Point {
  x: number;
  y: number;
}
