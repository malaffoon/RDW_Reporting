import { Injectable } from "@angular/core";
import { User } from "./model/user.model";
import { isNullOrUndefined } from "util";
import { Configuration } from "./model/configuration.model";

@Injectable()
export class UserMapper {

  mapFromApi(apiModel: any): User {
    let uiModel = new User();

    uiModel.firstName = apiModel.firstName;
    uiModel.lastName = apiModel.lastName;

    apiModel.permissions.forEach(permission => {
      uiModel.permissions.push(permission);
    });

    uiModel.configuration = this.mapConfigurationFromApi(apiModel.settings);

    return uiModel;
  }

  private mapConfigurationFromApi(apiModel: any): Configuration {
    let uiModel = new Configuration();

    if(isNullOrUndefined(apiModel))
      return uiModel;

    uiModel.analyticsTrackingId = apiModel.analyticsTrackingId;

    return uiModel;
  }
}
