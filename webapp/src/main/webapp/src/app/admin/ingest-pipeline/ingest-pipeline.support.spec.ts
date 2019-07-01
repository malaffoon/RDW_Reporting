import { getXmlParserErrors, isValidXml } from './ingest-pipeline.support';

const validXml = '<value></value>';
const unclosedXml = '<value>';
const invalidTRT = `
    <TDSReport>
      <Test academicYear="2018" assessmentType="Interim" assessmentVersion="11111" bankKey="777" contract="MOCK" grade="11"
            mode="online" name="(naturalId)MOCK-IAB-G11M-2017-2018" subject="Math"
            testId="MOCK-IAB-G11M-2017-2018"/>
      <Examinee key="100000000333">
        <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="StudentIdentifier"
                           value="SSID001"/>
    `;

describe('getXmlSyntaxErrors', () => {
  it('should get no errors when valid', () => {
    expect(getXmlParserErrors(validXml)).toEqual([]);
  });

  it('should report errors when there is an unclosed tag', () => {
    expect(getXmlParserErrors(unclosedXml).length).toBe(1);
  });

  it('should report errors when invalid TRT', () => {
    expect(getXmlParserErrors(invalidTRT).length).toBe(1);
  });
});

describe('isValidXml', () => {
  it('should be true when valid', () => {
    expect(isValidXml(validXml)).toBe(true);
  });

  it('should be false when there is an unclosed tag', () => {
    expect(isValidXml(unclosedXml)).toBe(false);
  });

  it('should be false when invalid TRT', () => {
    expect(isValidXml(invalidTRT)).toBe(false);
  });
});
