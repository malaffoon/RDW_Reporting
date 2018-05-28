import { Utils } from '../shared/support/support';
import { Student } from '../student/search/student';

export interface UserGroup {

  id?: number;
  name: string;
  subjectCodes: string[];
  students: Student[];

}

export interface UserGroupRequest {
  readonly id?: number;
  readonly name: string;
  readonly subjectCodes: string[];
  readonly studentIds: number[];
}

export function copy(group: UserGroup): UserGroup {
  const copy = <any>{};
  if (group.id != null) {
    copy.id = group.id;
  }
  copy.name = group.name;
  copy.subjectCodes = group.subjectCodes.concat();
  copy.students = group.students.concat();
  return copy;
}

export function equals(a: UserGroup, b: UserGroup): boolean {
  const idsOf = (students: Student[]) => students.map(student => student.id);
  return a === b
    || (
      a != null
      && b != null
      && a.id === b.id
      && a.name === b.name
      && Utils.equalSets(a.subjectCodes, b.subjectCodes)
      && Utils.equalSets(idsOf(a.students), idsOf(b.students))
    );
}
