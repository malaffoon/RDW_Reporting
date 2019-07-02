import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from '../core/window-ref.service';
import { isNullOrEmpty, Utils } from '../support/support';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scroll-nav',
  templateUrl: 'scroll-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollNavComponent {
  private _items: ScrollNavItem[] = [];
  private _activeItem: ScrollNavItem;
  private _window: Window;
  private _enabled = true;

  constructor(
    private translateService: TranslateService,
    private windowRef: WindowRefService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this._window = windowRef.nativeWindow;
  }

  get items(): ScrollNavItem[] {
    return this._items;
  }

  @Input()
  set items(values: ScrollNavItem[]) {
    if (this._items !== values) {
      this._items = isNullOrEmpty(values)
        ? []
        : values.map(item => {
            //Saturate text from translation key
            if (item.text == null && item.translationKey != null) {
              item = {
                ...item,
                text: this.translateService.instant(item.translationKey)
              };
            }
            return item;
          });
    }
  }

  ngOnInit(): void {
    if (!this.activeItem && this.items.length) {
      this._activeItem = this.items[0];
    }
  }

  get activeItem(): ScrollNavItem {
    return this._activeItem;
  }

  @Input()
  set activeItem(item: ScrollNavItem) {
    this._activeItem = item;
    const scrollTo = document.getElementById(item.id);
    if (scrollTo != null) {
      scrollTo.scrollIntoView();
    }
  }

  onItemClickInternal(item: ScrollNavItem): void {
    this.activeItem = item;
    if (item.click != null) {
      item.click();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Disabled because the item highlighting logic is very inaccurate and may cause more confusion than aid
    // this._enabled && this.updateActiveLink();
  }

  private updateActiveLink(): void {
    const { items, _window: window, _document: document } = this;

    // Sets the first item to active if the window scroll is zero
    if (window.scrollY <= 0) {
      this._activeItem = items[0];
    }

    // Sets the last item to active if the user scrolls to the very bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this._activeItem = items[items.length - 1];
      return;
    }

    const scrollTop = this.getWindowPageYOffset();

    // document.getElementById(item.scrollTo.id) is a HOTFIX for offsetTop javascript error
    // ngOnDestroy is not called in this component because it belongs to a "reusable" view
    // Angular does not currently support removal of global host listeners
    items
      .filter(item => document.getElementById(item.id))
      .forEach(item => {
        const itemOffsetTop = Utils.getAbsoluteOffsetTop(
          document.getElementById(item.id)
        );
        if (itemOffsetTop <= scrollTop) {
          this._activeItem = item;
        } else {
          return;
        }
      });
  }

  /**
   * Gets the window's page y offset in a cross-browser compliant manner
   *
   * @returns {number} the windows page y offset
   */
  private getWindowPageYOffset(): number {
    return (
      this._window.pageYOffset ||
      this._document.documentElement.scrollTop ||
      this._document.body.scrollTop ||
      0
    );
  }
}

export interface ScrollNavItem {
  readonly click?: any;
  readonly id?: string;
  readonly text?: string;
  readonly translationKey?: string;
  readonly classes?: string;
  readonly iconClasses?: string;
}
