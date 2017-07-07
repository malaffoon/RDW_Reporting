import { School } from "./school.model";
import { Group } from "./group.model";
import { Configuration } from "./configuration.model";

export class User {
  firstName: string;
  lastName: string;
  permissions: string[];
  groups: Group[];
  schools: School[];
  configuration: Configuration;

  constructor() {
    this.permissions = [];
    this.groups = [];
    this.schools = [];
    this.configuration = new Configuration();
  }
}
