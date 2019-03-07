import {
  createDistrict,
  createSchool,
  createSchoolGroup
} from './organizations';

describe('Organization', () => {
  describe('isOrIsAncestorOf', () => {
    it('should be true when schools are the same', () => {
      const schoolA = createSchool({ id: 1 });
      const schoolB = createSchool({ id: 2 });

      expect(schoolA.isOrIsAncestorOf(schoolA)).toBe(true);
      expect(schoolA.isOrIsAncestorOf(schoolB)).toBe(false);
    });

    it('should be true when school groups are the same or when they contain the organization', () => {
      const schoolGroupA = createSchoolGroup({ id: 1 });
      const schoolGroupB = createSchoolGroup({ id: 2 });
      const schoolA = createSchool({ id: 1, schoolGroupId: 1 });
      const schoolB = createSchool({ id: 2, schoolGroupId: 2 });

      expect(schoolGroupA.isOrIsAncestorOf(schoolGroupA)).toBe(true);
      expect(schoolGroupA.isOrIsAncestorOf(schoolGroupB)).toBe(false);
      expect(schoolGroupA.isOrIsAncestorOf(schoolA)).toBe(true);
      expect(schoolGroupA.isOrIsAncestorOf(schoolB)).toBe(false);
    });

    it('should be true when districts are the same or when they contain the organization', () => {
      const districtA = createDistrict({ id: 1 });
      const districtB = createDistrict({ id: 2 });
      const schoolA = createSchool({ id: 1, districtId: 1 });
      const schoolB = createSchool({ id: 2, districtId: 2 });

      expect(districtA.isOrIsAncestorOf(districtA)).toBe(true);
      expect(districtA.isOrIsAncestorOf(districtB)).toBe(false);
      expect(districtA.isOrIsAncestorOf(schoolA)).toBe(true);
      expect(districtA.isOrIsAncestorOf(schoolB)).toBe(false);
    });
  });
});
