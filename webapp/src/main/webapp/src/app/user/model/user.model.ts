import { School } from "./school.model";
import { Group } from "./group.model";

export class User {
  firstName: string;
  lastName: string;
  permissions: string[];
  groups: Group[];
  schools: School[];

  constructor() {
    this.permissions = [];
    this.groups = [];
    this.schools = [];
  }
}
