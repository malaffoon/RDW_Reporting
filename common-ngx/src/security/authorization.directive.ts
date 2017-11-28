import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthorizationService } from "./authorization.service";

/**
 * Structural directive that conditionally renders an element if the user has permission to view it.
 * Example usage: <div *hasAnyPermission="['GROUP_READ', 'GROUP_WRITE']"></div>
 */
@Directive({ selector: '[sbAuthorize],[hasAnyPermission]' })
export class AuthorizationDirective {

  private displayed: boolean;

  constructor(private authorizationService: AuthorizationService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  /**
   * @deprecated use hasAnyPermission
   */
  @Input()
  set sbAuthorize(permissions: string[]) {
    this.hasAnyPermission = permissions;
  }

  /**
   * Will display the view if the user has any of the provided permissions
   *
   * @param {string[]} permissions
   */
  @Input()
  set hasAnyPermission(permissions: string[]) {

    if (!permissions || permissions.length == 0) {
      throw new Error('Specify at least one permission to authorize against.');
    }

    this.authorizationService.hasAnyPermission(permissions)
      .subscribe(hasPermission => {
        if (hasPermission && !this.displayed) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.displayed = true;
        } else if (!hasPermission && this.displayed) {
          this.viewContainer.clear();
          this.displayed = false;
        }
      });
  }
}
