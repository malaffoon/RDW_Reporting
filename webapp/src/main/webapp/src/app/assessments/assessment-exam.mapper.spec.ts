import { AssessmentExamMapper } from "./assessment-exam.mapper";
describe('AssessmentExam mapper', () => {

  it('should format targets and remove everything after the dash', () => {
    let fixture = new AssessmentExamMapper();

    let actual = fixture.formatTarget("D-3");
    expect(actual).toBe("D");
  });

  it('should format larger targets and remove everything after the dash', () => {
    let fixture = new AssessmentExamMapper();

    let actual = fixture.formatTarget("DBDB-3");
    expect(actual).toBe("DBDB");
  });

  it('should do nothing if there is no dash', () => {
    let fixture = new AssessmentExamMapper();

    let actual = fixture.formatTarget("D");
    expect(actual).toBe("D");
  });
});
