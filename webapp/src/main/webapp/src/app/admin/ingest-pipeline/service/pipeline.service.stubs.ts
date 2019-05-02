import { Pipeline, PipelineScript, PipelineTest } from '../model/pipeline';

const trt = `<TDSReport>
  <Test academicYear="2018" assessmentType="Interim" assessmentVersion="11111" bankKey="777" contract="MOCK" grade="11"
        mode="online" name="(naturalId)MOCK-IAB-G11M-2017-2018" subject="Math"
        testId="MOCK-IAB-G11M-2017-2018"/>
  <Examinee key="100000000333">
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="StudentIdentifier"
                       value="SSID001"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="AlternateSSID"
                       value="ASSID001"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="Birthdate" value="2001-06-23"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="FirstName" value="Gladys"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="LastOrSurname" value="Durrant"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="Sex" value="Female"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="GradeLevelWhenAssessed" value="11"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="HispanicOrLatinoEthnicity" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="AmericanIndianOrAlaskaNative" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="Asian" value="Yes"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="BlackOrAfricanAmerican" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="White" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="NativeHawaiianOrOtherPacificIslander"
                       value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="Filipino" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="DemographicRaceTwoOrMoreRaces" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="IDEAIndicator" value="Yes"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="LEPStatus" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="Section504Status" value="No"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="EconomicDisadvantageStatus" value="Yes"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="StudentGroupName" value="G11-17500"/>
    <ExamineeAttribute context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="StudentGroupName" value="G11-17600"/>
    <ExamineeRelationship context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="StateAbbreviation" value="CA"/>
    <ExamineeRelationship context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="StateName" value="California"/>
    <ExamineeRelationship context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="DistrictId"
                          value="TD000001"/>
    <ExamineeRelationship context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="DistrictName"
                          value="Test District TD000001"/>
    <ExamineeRelationship context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="SchoolId"
                          value="TS000001"/>
    <ExamineeRelationship context="FINAL" contextDate="2018-05-01T08:05:00.000000" name="SchoolName" value="Test School TS000001"/>
  </Examinee>
  <Opportunity abnormalStarts="0" administrationCondition="SD" assessmentParticipantSessionPlatformUserAgent="" clientName="SBAC"
               completeStatus="Complete" completeness="Complete" database="session" dateCompleted="2018-05-01T08:50:00.000000"
               effectiveDate="2018-05-01" ftCount="0" gracePeriodRestarts="0" itemCount="15"
               key="096c4896-dc65-4e7b-a626-9f5257195a9d" oppId="100000000010" opportunity="5" pauseCount="0"
               server="ip-10-113-148-45" sessionId="WEL-bd74" startDate="2018-05-01T08:05:00.000000" status="scored"
               statusDate="2018-05-01T08:50:00.000000" windowId="WINDOW_ID">
    <Segment algorithm="Fixed" algorithmVersion="0" id="5a703740-3a00-46bf-a065-91dfc9ee93e0" position="1"/>
    <Accommodation code="NEA_Calc" segment="0" type="type001" value="value001"/>
    <Score measureLabel="ScaleScore" measureOf="Overall" standardError="42.0" value="2821.3333333333335"/>
    <Score measureLabel="PerformanceLevel" measureOf="Overall" standardError="" value="3"/>
    <Score measureLabel="ScaleScore" measureOf="1" standardError="42.0" value="2821.3333333333335"/>
    <Score measureLabel="PerformanceLevel" measureOf="1" standardError="" value="3"/>
    <Item adminDate="2018-05-01T08:20:00.000000" bankKey="777" dropped="0" format="MC" isSelected="1" key="50001" mimeType="text/plain"
          numberVisits="1" operational="1" pageNumber="1" pageTime="10502" pageVisits="1" position="3" responseDuration="10.502"
          score="1" scoreStatus="SCORED" segmentId="5a703740-3a00-46bf-a065-91dfc9ee93e0">
      <Response date="2018-05-01T08:25:00.000000" type="value">A</Response>
    </Item>
    <Item adminDate="2018-05-01T08:20:00.000000" bankKey="777" dropped="0" format="MC" isSelected="1" key="50002" mimeType="text/plain"
          numberVisits="1" operational="1" pageNumber="1" pageTime="1894" pageVisits="1" position="11" responseDuration="1.894"
          score="1" scoreStatus="SCORED" segmentId="5a703740-3a00-46bf-a065-91dfc9ee93e0">
      <Response date="2018-05-01T08:25:00.000000" type="value">C</Response>
    </Item>
    <Item adminDate="2018-05-01T08:20:00.000000" bankKey="777" dropped="0" format="MI" isSelected="1" key="50003" mimeType="text/plain"
          numberVisits="1" operational="1" pageNumber="1" pageTime="26450" pageVisits="1" position="15" responseDuration="26.45"
          score="1" scoreStatus="SCORED" segmentId="5a703740-3a00-46bf-a065-91dfc9ee93e0">
      <Response date="2018-05-01T08:25:00.000000" type="value">MI response</Response>
    </Item>
    <Item adminDate="2018-05-01T08:20:00.000000" bankKey="777" dropped="0" format="MI" isSelected="1" key="50004" mimeType="text/plain"
          numberVisits="1" operational="1" pageNumber="1" pageTime="16629" pageVisits="1" position="9" responseDuration="16.629"
          score="1" scoreStatus="SCORED" segmentId="5a703740-3a00-46bf-a065-91dfc9ee93e0">
      <Response date="2018-05-01T08:25:00.000000" type="value">MI response</Response>
    </Item>
    <Item adminDate="2018-05-01T08:20:00.000000" bankKey="777" dropped="0" format="MC" isSelected="1" key="50005" mimeType="text/plain"
          numberVisits="1" operational="1" pageNumber="1" pageTime="13563" pageVisits="1" position="12" responseDuration="13.563"
          score="1" scoreStatus="SCORED" segmentId="5a703740-3a00-46bf-a065-91dfc9ee93e0">
      <Response date="2018-05-01T08:25:00.000000" type="value">D</Response>
    </Item>
  </Opportunity>
</TDSReport>`;

export const stubIngestPipelines: Pipeline[] = <Pipeline[]>[
  {
    id: 'assessment',
    inputType: 'xml'
  },
  {
    id: 'exam',
    inputType: 'xml'
  },
  {
    id: 'group',
    inputType: 'csv'
  }
];

export const stubPipelineScript: PipelineScript = {
  id: 1,
  language: 'groovy',
  updatedBy: 'System',
  body: `transform '//Item' by { item ->
  if (item.bankKey.startsWith('10')) {
    item.bankKey = item.bankKey.substring(2)
  }
}

transform '//Response' by { response ->
  def text = response.text

  if (text.contains('choiceInteraction_1') && text.contains('choiceInteraction_2')) {
    response.text = text
            .replaceAll(~/choiceInteraction_(\\d).RESPONSE/, 'EBSR$1')
            .replaceAll(~/choiceInteraction_\\d-choice-(\\w)/, '$1')

  } else if (text.contains('choiceInteraction_1')) {
      def matches = text =~ /choiceInteraction_1-choice-(\\w)/
      if (matches.count > 0) {
          response.text = matches.collect { it[1] }.join(',')
      }

  } else if (text.contains('matchInteraction')) {
    response.text = text
            .replaceAll(~/matchInteraction_\\d.RESPONSE/, 'RESPONSE')
            .replaceAll(~/matchInteraction_\\d-(\\d)\\W*matchInteraction_\\d-(\\w)/, '$1 $2')

  } else if (text.contains('hotTextInteraction_')) {
      response.text = text
              .replaceAll(~/hotTextInteraction_(\\d).RESPONSE/, '$1')
              .replaceAll(~/hotTextInteraction_\\d-hottext-(\\d)/, '$1')

  } else if (text.contains('equationInteraction_') ||
             text.contains('tableInteraction_') ||
             text.contains('gridInteraction_') ||
             text.contains('textEntryInteraction_')) {
    response.text = text
            .replaceAll(~/(?s).+<value>(.+)<\\/value>.+/, '$1')
            .unescapeHtmlTags()
  }
}

outputXml
`
};

export const stubPipelineTests: PipelineTest[] = [1, 2, 3, 4, 5].map(
  (id, index) => ({
    id,
    createdOn: new Date(),
    updatedBy: 'John Smith',
    name: 'It should do the thing I want it to do when it runs'
  })
);

export const stubPipelineTest: Partial<PipelineTest> = {
  input: trt,
  output: trt
};

export function createPassingTest(test: PipelineTest): PipelineTest {
  test = {
    ...test,
    ...stubPipelineTest
  };
  return {
    ...test,
    result: {
      passed: true,
      actualOutput: test.output
    }
  };
}

export function createFailingTest(test: PipelineTest): PipelineTest {
  test = {
    ...test,
    ...stubPipelineTest
  };
  return {
    ...test,
    result: {
      passed: false,
      actualOutput: test.output
        .replace(/FINAL/g, 'INTERIM')
        .substring(0, test.output.length - 2000)
    }
  };
}
