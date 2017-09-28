import { OrganizationType } from "./organization-type.enum";

export interface Organization {
  id: number;
  name: string;
  schoolId?: number;
  schoolGroupId?: number;
  districtId?: number;
  districtGroupId?: number;
  type: OrganizationType;
  isOrIsAncestorOf?: (x: any) => boolean;
}
