import {randomId} from "./support/generator";
import {sortAscOn} from "../../shared/comparators";

export const groups = sortAscOn([
  {
    name: 'Anderson, Mary 4th Grade Math Noon',
    size: 27
  },
  {
    name: 'Anderson, Mary 4th Grade Math Morning',
    size: 13
  },
  {
    name: 'Vista Advanced Math',
    size: 30
  }
].map((group:any) => {
  return Object.assign(group, {
    id: randomId(),
    district: 'Vista Unified',
    school: 'Vista Elementary',
    subject: "Mathematics"
  })
}), group => group.name);
