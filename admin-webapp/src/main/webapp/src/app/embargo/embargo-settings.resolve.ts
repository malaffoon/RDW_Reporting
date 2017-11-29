import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { EmbargoService } from "./embargo.service";
import { EmbargoSettings } from "./embargo-settings";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EmbargoSettingsResolve implements Resolve<EmbargoSettings> {

  constructor(private service: EmbargoService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): EmbargoSettings | Observable<EmbargoSettings> | Promise<EmbargoSettings> {
    return this.service.getEmbargoSettings();
  }

}
