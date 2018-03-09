import { Injectable } from "@angular/core";
import { User } from "./model/user.model";

@Injectable()
export class UserMapper {

  mapFromApi(serverUser: any): User {
    const user: User = new User();
    user.firstName = serverUser.firstName;
    user.lastName = serverUser.lastName;
    user.permissions = serverUser.permissions;
    return user;
  }

}
