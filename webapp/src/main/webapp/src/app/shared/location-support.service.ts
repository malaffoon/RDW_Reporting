import { Injectable } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";

@Injectable()
export class LocationSupportService {

  /**
   * True when a user clicks on a link in the app after their initial navigation to the app.
   */
  private hasInternalNavigationHistory;

  constructor(private router: Router) {
    router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        this.hasInternalNavigationHistory = true;
      })
  }

  /**
   * Navigates user to the previous page or the home page if the current page is their first page.
   */
  goBackOrHome(): void {
    if (this.previousLocationIsInternal) {
      window.history.back();
    } else {
      this.router.navigate([ '/' ]);
    }
  }

  /**
   * @returns True if the previous page the user visited is within the application
   */
  private get previousLocationIsInternal(): boolean {
    // This will be true when a user clicks on a link in the app after their initial navigation to the page.
    return this.hasInternalNavigationHistory
      // In the event that a user has internal navigation history but performed a page refresh,
      // we can still gather this information by checking if the document referrer matches the current domain.
      || this.referrerIsInternal;
  }

  private get referrerIsInternal(): boolean {
    return this.getDomain(document.referrer) === this.getDomain(location.href);
  }

  private getDomain(url: string): string {
    if (url == null) {
      return null;
    }
    return url.replace('http://','')
      .replace('https://','')
      .split(/[/?#]/)[0];
  }

}
