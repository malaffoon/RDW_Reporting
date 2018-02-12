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
  private _marginTop: number = 0;
  private _initialStyles: any;
  private _initialAbsoluteOffset: Point;
  private _initialized: boolean = false;

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
      const style = nativeElement.style;
      this._initialStyles = {
        position: style.position,
        top: style.top,
        left: style.left
      };
      this._initialAbsoluteOffset = Utils.getAbsoluteOffset(nativeElement);
      this._initialized = true;
    });
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  onWindowScrollAndResize(event: Event): void {

    if (!this._initialized) {
      return;
    }

    const pixelsOf = Utils.formatPixels,
      style = this._element.nativeElement.style,
      scrollX = this._window.pageXOffset,
      scrollY = this._window.pageYOffset,
      initialX = this._initialAbsoluteOffset.x,
      initialY = this._initialAbsoluteOffset.y - this._marginTop;

    if (scrollY > initialY) {

      // apply sticky styles
      style.position = PositionFixed;
      style.top = pixelsOf(this._marginTop);

      // correct the position: fixed element's left offset
      // without this the element will move along the x-axis when the page scrolls horizontally
      if (scrollX > 0) {

        // TODO fix choppyness
        style.left = `${initialX - scrollX}px`;
      } else {
        style.left = this._initialStyles.left;
      }

    } else {

      // reset styles
      style.position = this._initialStyles.position;
      style.top = this._initialStyles.top;
      style.left = this._initialStyles.left;
    }
  }

}

interface Point {
  x: number;
  y: number;
}
