import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Represents a menu option
 */
export interface MenuOption {
  click?: (event: MouseEvent) => void;
  label?: string;
  disabled?: boolean;
  tooltip?: string;
  options?: Observable<MenuOption[]>;
}

/**
 * This component is responsible for displaying a table-row menu button
 * with configurable actions.
 *
 * This component is built using the same styles as the ngx-bootstrap
 * dropdown component, but does not bind a document click listener on
 * instantiation for lightweight display of many menus.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  _label: string = '';
  _hasLabel: boolean = true;
  _options: MenuOption[] = [];
  private _open: boolean;
  private _childOptionsByOptions: Map<MenuOption, MenuOption[]> = new Map();
  private _removeDocumentListener: () => void;

  constructor(private renderer: Renderer2, private domElement: ElementRef) {}

  @Input()
  set label(value: string) {
    this._label = (value || '').trim();
    this._hasLabel = this._label.length !== 0;
  }

  @Input()
  set options(values: MenuOption[]) {
    this._options = (values || []).slice();
  }

  public get open(): boolean {
    return this._open;
  }

  /**
   * When opening the menu, bind a click listener to the document to close
   * the menu if the user clicks outside.
   *
   * @param value True to open the menu, false to close
   */
  public set open(value: boolean) {
    if (this._open === value) {
      return;
    }
    this._open = value;
    if (value) {
      this._removeDocumentListener = this.renderer.listen(
        document,
        'click',
        this.onClick.bind(this)
      );
    } else if (this._removeDocumentListener != null) {
      this._removeDocumentListener();
    }
  }

  childOptionsLoading(option: MenuOption): boolean {
    return (
      option.options != null && this._childOptionsByOptions.get(option) == null
    );
  }

  public getOrLoadChildOptions(option: MenuOption): MenuOption[] {
    const { _childOptionsByOptions: cache } = this;
    const existingChildOptions = cache.get(option);
    if (!existingChildOptions) {
      // TODO subscription management
      option.options.subscribe(childOptions => {
        cache.set(option, childOptions);
      });
    }
    return existingChildOptions || [];
  }

  onMenuOptionClick(option: MenuOption, event: MouseEvent): void {
    this.open = false;
    event.preventDefault();
    if (option.click != null) {
      option.click(event);
    }
  }

  /**
   * Handle a document click event.  If it is outside of the menu, close the menu.
   *
   * @param event A document click event
   */
  onClick(event: MouseEvent): void {
    this.open = this.domElement.nativeElement.contains(event.target);
  }
}
