import {
  RouteReuseStrategy,
  DetachedRouteHandle,
  ActivatedRouteSnapshot
} from '@angular/router';
import { HomeComponent } from '../home/home.component';

export class RdwRouteReuseStrategy implements RouteReuseStrategy {
  handlers: { [key: string]: DetachedRouteHandle | any } = {};

  /**
   * Determines if this route (and its subtree) should be detached to be reused later
   * @param route the current route
   * @returns returns true if the route's data.canReuse evaluates as truthy
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['canReuse'];
  }

  /**
   * Saves the handle for the detached route.  This will also remove any existing handles of the same component type.
   * @param route The current route
   * @param handle The handle to save.
   */
  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | any
  ): void {
    // Only allow one handler per component type to minimize memory usage
    for (let key in this.handlers) {
      if (
        this.handlers[key] &&
        this.handlers[key].componentRef &&
        handle &&
        handle.componentRef &&
        this.handlers[key].componentRef.componentType ==
          handle.componentRef.componentType
      ) {
        this.handlers[key] = null;
      }
    }

    this.handlers[this.getKey(route)] = handle;
  }

  /**
   * Determines if this route should be reattached.  If the current route navigates to the HomeComponent, the handlers are cleared.
   * @param route the current route
   * @returns true if the route's data.canReuse evaluates as truthy and a handler exists.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.component == HomeComponent) {
      this.handlers = {};
      return false;
    }

    return (
      route.data['canReuse'] &&
      !!route.routeConfig &&
      !!this.handlers[this.getKey(route)]
    );
  }

  /**
   * Gets the previously stored route
   * @param route
   * @returns the previously stored route or null
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.data['canReuse'] || !route.routeConfig) return null;

    return this.handlers[this.getKey(route)];
  }

  /**
   * Determines if a route should be reused
   * @param future The route being navigated to
   * @param curr The route being navigated from
   * @returns true if the route should be reused.
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getKey(route: ActivatedRouteSnapshot) {
    return route.parent.url.join('/');
  }
}
