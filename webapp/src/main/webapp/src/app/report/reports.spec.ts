import { isEqualReportQuery } from './reports';
import {
  AggregateReportStudentFilters,
  CustomAggregateReportQuery,
  DistrictSchoolExportReportQuery,
  GroupPrintableReportQuery,
  ReportQuery,
  SchoolGradePrintableReportQuery,
  StudentPrintableReportQuery
} from './report';

function student(): StudentPrintableReportQuery {
  return {
    name: 'student',
    type: 'Student',
    schoolYear: 1,
    disableTransferAccess: false,
    subjectCode: 'subject1',
    assessmentTypeCode: 'assessmentType1',
    language: 'language1',
    accommodationsVisible: false,
    studentId: 1
  };
}

function schoolGrade(): SchoolGradePrintableReportQuery {
  return {
    name: 'school grade',
    type: 'SchoolGrade',
    schoolYear: 1,
    disableTransferAccess: false,
    subjectCode: 'subject1',
    assessmentTypeCode: 'assessmentType1',
    language: 'language1',
    accommodationsVisible: false,
    order: 'StudentName',
    schoolId: 1,
    gradeId: 1
  };
}

function group(): GroupPrintableReportQuery {
  return {
    name: 'school gade',
    type: 'SchoolGrade',
    schoolYear: 1,
    disableTransferAccess: false,
    subjectCode: 'subject1',
    assessmentTypeCode: 'assessmentType1',
    language: 'language1',
    accommodationsVisible: false,
    order: 'StudentName',
    groupId: {
      type: 'Teacher',
      id: 1
    }
  };
}

function code(prefix: string, value: number = 1): string {
  return `${prefix}_${value}`;
}

function codes(prefix: string): string[] {
  return [1, 2].map(value => code(prefix, value));
}

function studentFilters(): AggregateReportStudentFilters {
  return {
    ethnicityCodes: codes('ethnicity'),
    genderCodes: codes('grade'),
    individualEducationPlanCodes: codes('iep'),
    limitedEnglishProficiencyCodes: codes('lep'),
    englishLanguageAcquisitionStatusCodes: codes('las'),
    migrantStatusCodes: codes('migrantStatus'),
    section504Codes: codes('section504'),
    languageCodes: codes('language'),
    militaryConnectedCodes: codes('militaryConnected'),
    economicDisadvantageCodes: codes('economicDisadvantage')
  };
}

function customAggregate(): CustomAggregateReportQuery {
  return {
    name: 'custom aggregate',
    type: 'CustomAggregate',
    administrativeConditionCodes: codes('administrativeCondition'),
    assessmentGradeCodes: codes('assessmentGrade'),
    assessmentTypeCode: code('asssessmentType'),
    completenessCodes: codes('completeness'),
    dimensionTypes: codes('dimensionType'),
    includeAllDistricts: false,
    includeAllDistrictsOfSchools: false,
    includeAllSchoolsOfDistricts: false,
    includeState: false,
    showEmpty: false,
    columnOrder: codes('column'),
    studentFilters: studentFilters(),
    schoolIds: [1, 2],
    districtIds: [3, 4],
    subjectCodes: codes('subject'),
    achievementLevelDisplayType: code('achievmentLevel'),
    valueDisplayType: code('valueDisplay'),
    subgroups: {
      a: studentFilters()
    }
  };
}

function districtSchoolExport(): DistrictSchoolExportReportQuery {
  return {
    name: 'district school export',
    type: 'DistrictSchoolExport',
    schoolYear: 1,
    disableTransferAccess: false,
    schoolIds: [1, 2],
    schoolGroupIds: [3, 4],
    districtIds: [5, 6],
    districtGroupIds: [7, 8]
  };
}

function getDifferentValueOfSamePrimitiveType(value: any): any {
  const type = typeof value;
  switch (type) {
    case 'boolean':
      return !value;
    case 'number':
      return value + 1;
    case 'string':
      return '~' + value;
  }
  throw new Error(`unexpected type "${type}" for value ${value}`);
}

interface FieldTest {
  key: string;
  change: (value: any) => any;
  expected: boolean;
}

interface TestCase {
  query: ReportQuery;
  tests?: FieldTest[];
}

function expectSetEqualityCheckOnArray(key: string): FieldTest[] {
  return [
    {
      key,
      change: value => value.concat(100),
      expected: false
    },
    {
      key,
      change: value => value.slice().reverse(),
      expected: true
    }
  ];
}

const testCases: TestCase[] = [
  {
    query: student()
  },
  {
    query: schoolGrade()
  },
  {
    query: group()
  },
  {
    query: districtSchoolExport(),
    tests: [
      ...expectSetEqualityCheckOnArray('schoolIds'),
      ...expectSetEqualityCheckOnArray('schoolGroupIds'),
      ...expectSetEqualityCheckOnArray('districtIds'),
      ...expectSetEqualityCheckOnArray('districtGroupIds')
    ]
  },
  {
    query: customAggregate(),
    tests: [
      ...expectSetEqualityCheckOnArray('administrativeConditionCodes'),
      ...expectSetEqualityCheckOnArray('assessmentGradeCodes'),
      ...expectSetEqualityCheckOnArray('completenessCodes'),
      ...expectSetEqualityCheckOnArray('dimensionTypes'),
      ...expectSetEqualityCheckOnArray('schoolIds'),
      ...expectSetEqualityCheckOnArray('districtIds'),
      ...expectSetEqualityCheckOnArray('subjectCodes'),
      {
        key: 'studentFilters',
        change: value => ({
          ...value,
          economicDisadvantageCodes: codes('different')
        }),
        expected: false
      },
      {
        key: 'subgroups',
        change: value => ({
          ...value,
          b: studentFilters()
        }),
        expected: false
      },
      {
        key: 'subgroups',
        change: value => ({
          a: {
            ...value.a,
            economicDisadvantageCodes: codes('different')
          }
        }),
        expected: false
      }
    ]
  }
];

// TODO add set comparison assertions for subgroups and studentFilters
describe('isEqualReportQuery', () => {
  // basic (non recursive) field by field inequality testing
  testCases.forEach(({ query, tests = [] }) => {
    it(`${query.type}: should be true when comparing identical values`, () => {
      expect(isEqualReportQuery(query, query)).toBe(true);
    });

    Object.entries(query).forEach(([key, value]) => {
      const isPrimitiveValue = typeof value !== 'object';

      const differentValue = isPrimitiveValue
        ? getDifferentValueOfSamePrimitiveType(value)
        : null;

      it(`${
        query.type
      }: should be false when comparing ${key} of ${value} to ${differentValue}`, () => {
        expect(
          isEqualReportQuery(query, { ...query, [key]: differentValue })
        ).toBe(false);
      });
    });

    tests.forEach(({ key, change, expected }) => {
      const value = query[key];
      const differentValue = change(value);
      it(`${
        query.type
      }: should be ${expected} when comparing ${key} of ${value} to ${differentValue}`, () => {
        expect(
          isEqualReportQuery(query, { ...query, [key]: differentValue })
        ).toBe(expected);
      });
    });
  });
});
