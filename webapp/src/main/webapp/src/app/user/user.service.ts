import { Injectable } from "@angular/core";
import { UserMapper } from "./user.mapper";
import { CachingDataService } from "../shared/cachingData.service";

@Injectable()
export class UserService {
  constructor(private _mapper : UserMapper, private _dataService : CachingDataService) {
  }

  getCurrentUser() {
    return this._dataService
      .get("/user")
      .map(x => this._mapper.mapFromApi(x));
  }
}
