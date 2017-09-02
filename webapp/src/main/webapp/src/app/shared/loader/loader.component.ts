import { Component } from "@angular/core";
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'loader',
  templateUrl: 'loader.component.html'
})
export class LoaderComponent {

  loading: boolean = false;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd
        || event instanceof NavigationCancel
        || event instanceof NavigationError) {
        this.loading = false;
      }
    })
  }

}
