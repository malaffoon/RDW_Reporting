import {AssessmentSubjectType} from "../../shared/assessment-subject-type.enum";
import {AssessmentType} from "../../shared/assessment-type.enum";
import {randomId, randomIntegerOfLength, intBetween} from "./support/generator";
import {iab_items} from "./iab-items";

export const exams = [
  {
    date: new Date(2017, 1, 2),
    performance: 0,
    score: 2321,
    grade: 4,
    assessment: {
      id: 1,
      type: AssessmentType.IAB,
      name: 'Number and Operations - Fractions',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    date: new Date(2017, 1, 4),
    performance: 0,
    score: 2339,
    grade: 4,
    assessment: {
      id: 2,
      type: AssessmentType.IAB,
      name: 'Measurement and Data',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    id: randomId(),
    date: new Date(2017, 1, 7),
    performance: 0,
    score: 2344,
    grade: 4,
    assessment: {
      id: 3,
      type: AssessmentType.IAB,
      name: 'Geometry',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    date: new Date(2017, 1, 15),
    performance: 0,
    score: 2378,
    grade: 4,
    assessment: {
      id: 1,
      type: AssessmentType.IAB,
      name: 'Number and Operations - Fractions',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    date: new Date(2017, 1, 15),
    performance: 1,
    score: 2447,
    grade: 4,
    assessment: {
      id: 2,
      type: AssessmentType.IAB,
      name: 'Measurement and Data',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    date: new Date(2017, 1, 15),
    performance: 2,
    score: 2595,
    grade: 4,
    assessment: {
      id: 3,
      type: AssessmentType.IAB,
      name: 'Geometry',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    date: new Date(2017, 1, 20),
    performance: 2,
    score: 2520,
    grade: 4,
    assessment: {
      id: 4,
      type: AssessmentType.IAB,
      name: 'Mathematics Performance Task',
      grade: 4,
      academicYear: 2016,
      subject: AssessmentSubjectType.MATH
    }
  },
  {
    date: new Date(2017, 1, 20),
    performance: 2,
    score: 2520,
    grade: 5,
    assessment: {
      id: 5,
      type: AssessmentType.ICA,
      name: 'Operations and Algebraic Thinking',
      grade: 5,
      academicYear: 2017,
      subject: AssessmentSubjectType.MATH
    }
  }
].map((exam:any) => {
  exam.id = randomId();
  exam.items = iab_items;
  return exam;
});
