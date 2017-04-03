import {sortAscOn} from "../../shared/comparators";
import {randomId, randomSsid} from "./support/generator";
import {AssessmentType} from "../../shared/assessment-type.enum";
import {AssessmentSubjectType} from "../../shared/assessment-subject-type.enum";

/*
  item_result
    item
      results (reverse)

  assessment_result
    assessment
      results (reverse)
 */

let commonVendorId = '2B3C34BF-064C-462A-93EA-41E9E3EB8333';

export const iab_items = [
  {
    claim: 'Concepts and Procedures',
    target: 'Target F',
    score: 0,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2703"}],"layout":"WAI"}'
    }
  },
  {
    claim: 'Problem Solving',
    target: 'Target A',
    score: 2,
    maximumScore: 2,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test123</p>","id":"I-200-22581"}]}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target F',
    score: 1,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test123</p>","bankKey":"187", "itemKey":"2708"}],"layout":"23"}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target E',
    score: 2,
    maximumScore: 2,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-1839"}],"layout":"WAI"}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target G',
    score: 1,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>alla</p>","id":"I-187-2700"}]}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target G',
    score: 0,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2704"}],"layout":"WAI"}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target H',
    score: 2,
    maximumScore: 2,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2705"}],"layout":"WAI"}'
    }
  }
].map((item: any, index) => {
  item.id = randomId();
  item.number = index + 1;
  return item;
});

export const assessments = [
  {
    id: 1,
    type: AssessmentType.IAB,
    name: 'Number and Operations - Fractions',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 2,
    type: AssessmentType.IAB,
    name: 'Measurement and Data',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 3,
    type: AssessmentType.IAB,
    name: 'Geometry',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 4,
    type: AssessmentType.IAB,
    name: 'Mathematics Performance Task',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 5,
    type: AssessmentType.IAB,
    name: 'Operations and Algebraic Thinking',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  }
];

export const exams_of_student = [
  {
    date: new Date(2017, 1, 2),
    performance: 0,
    score: 2321,
    grade: 4,
    assessment: assessments[0]
  },
  {
    date: new Date(2017, 1, 4),
    performance: 0,
    score: 2339,
    grade: 4,
    assessment: assessments[1]
  },
  {
    date: new Date(2017, 1, 7),
    performance: 0,
    score: 2344,
    grade: 4,
    assessment: assessments[0]
  },
  {
    date: new Date(2017, 1, 15),
    performance: 0,
    score: 2378,
    grade: 4,
    assessment: assessments[2]
  },
  {
    date: new Date(2017, 1, 15),
    performance: 1,
    score: 2447,
    grade: 4,
    assessment: assessments[1]
  },
  {
    date: new Date(2017, 1, 15),
    performance: 2,
    score: 2595,
    grade: 4,
    assessment: assessments[3]
  },
  {
    date: new Date(2017, 1, 20),
    performance: 2,
    score: 2520,
    grade: 4,
    assessment: assessments[4]
  },
  {
    date: new Date(2017, 1, 20),
    performance: 2,
    score: 2520,
    grade: 4,
    assessment: assessments[4]
  }
].map((exam: any, index: number) => {
  exam.id = randomId();
  exam.items = iab_items;
  return exam;
});

export const students = [
  {firstName: "David", lastName: "Hayden"},
  {firstName: "Clementine", lastName: "Roach"},
  {firstName: "Hasad", lastName: "Valenzuela"},
  {firstName: "Joe", lastName: "Smith"},
  {firstName: "Joseph", lastName: "Cleveland"},
  {firstName: "Sara", lastName: "Blankenship"},
  {firstName: "Linus", lastName: "Todd"},
  {firstName: "Hope", lastName: "Cardinas"}
].map((student: any, index: number) => {
  student.id = index;
  student.ssid = randomSsid();
  student.exams = exams_of_student;
  return student;
});

sortAscOn(students, student => student.lastName, student => student.firstName);

export const mock_student = students[0];

export const groups = [
  {name: 'Anderson, Mary Grade 4 Math Noon', size: 27},
  {name: 'Anderson, Mary Grade 4 Math Morning', size: 13},
  {name: 'Vista Advanced Math', size: 30}
].map((group: any, index: number) => {
  return Object.assign(group, {
    id: index + 1,
    district: 'Vista Unified',
    school: 'Vista Elementary',
    subject: 'Mathematics',
    students: students
  })
});

sortAscOn(groups, group => group.name);

export const mock_group = groups[0];

export const exams_of_group = [
  {date: new Date(2017, 1, 15), assessment: assessments[0], students: {total: 6, below: .33, near: .33, above: .33, averagePerformance: 1, averageScore: 2350}},
  {date: new Date(2017, 1, 14), assessment: assessments[0], students: {total: 2, below: 0, near: .5, above: .5, averagePerformance: 2, averageScore: 2400}},
  {date: new Date(2016, 8, 12), assessment: assessments[1], students: {total: 2, below: .5, near: .5, above: 0, averagePerformance: 1, averageScore: 2344}},
  {date: new Date(2016, 7, 8), assessment: assessments[1], students: {total: 20, below: .5, near: 0, above: .5, averagePerformance: 1, averageScore: 2378}},
  {date: new Date(2016, 5, 10), assessment: assessments[2], students: {total: 20, below: .2, near: .2, above: .6, averagePerformance: 1, averageScore: 2595}},
  {date: new Date(2016, 3, 20), assessment: assessments[3], students: {total: 20, below: .1, near: .4, above: .5, averagePerformance: 1, averageScore: 2520}},
  {date: new Date(2016, 2, 2), assessment: assessments[2], students: {total: 20, below: .1, near: .4, above: .5, averagePerformance: 1, averageScore: 2520}},
  {date: new Date(2016, 1, 12), assessment: assessments[4], students: {total: 20, below: .1, near: .4, above: .5, averagePerformance: 1, averageScore: 2520}}
].map((exam:any, index: number, exams:Array<any>) => {
  exam.id = randomId();
  exam.session = 'ma-0' + (exams.length - index);
  exam.grade = 4;
  exam.attempt = 1;
  return exam;
});

export const group = Object.assign(groups[0], {
  exams: exams_of_group
});

let exams_of_session_a = [
  {performance: 0, score: 2300},
  {performance: 0, score: 2350}
].map((exam:any) => {
  exam.date = exams_of_group[0].date;
  exam.session = exams_of_group[0].session;
  exam.attempt = 1;
  return exam;
});

let exams_of_session_b = [
  {performance: 0, score: 2300},
  {performance: 0, score: 2350},
  {performance: 1, score: 2400},
  {performance: 2, score: 2450},
  {performance: 2, score: 2500}
].map((exam:any) => {
  exam.date = exams_of_group[1].date;
  exam.session = exams_of_group[1].session;
  exam.attempt = 2;
  return exam;
});

let exams_for_sessions_ab = exams_of_session_a.concat(exams_of_session_b);

export const exams_of_sessions = exams_for_sessions_ab
.map((exam:any, index:number) => {
  exam.grade = 4;
  exam.assessment = assessments[0];
  exam.student = students[index];
  return exam;
});

export const items_by_points_earned = [
  {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [2, 6]},
  {name: 'Problem Solving', target: 'Target A', studentsByScore: [4, 2, 2]},
  {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [2, 6]},
  {name: 'Communicating Reasoning', target: 'Target E', studentsByScore: [5, 3]},
  {name: 'Concepts and Procedures', target: 'Target G', studentsByScore: [2, 4, 2]},
  {name: 'Concepts and Procedures', target: 'Target G', studentsByScore: [2, 6]},
  {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [2, 6]}
].map((item: any, index:number) => {
  item.number = index + 1;
  item.id = index;
  item.exam = exams_of_group[0];
  item.percentStudentsByScore = item.studentsByScore.map((count, index, counts) => count / counts.reduce((total, count) => total + count), 0);
  return item;
});

export const mock_item:any = {
  number: 1,
  name: 'Concepts and Procedures',
  target: 'Target F',
  maximumScore: 1,
  exam: exams_of_group[0]
};

export const mock_item_results = [
  {attempt: 1},
  {attempt: 1},
  {attempt: 2},
  {attempt: 2},
  {attempt: 2},
  {attempt: 2},
  {attempt: 2}
].map((object:any, index:number) => {
  object.student = students[index];
  object.score = index < 2 ? 0 : 1;
  return Object.assign(object, mock_item);
});

mock_item.results = mock_item_results;

export const mock_rubrics = [
  {
  itemId: 1,
  list: [{
    name: 'Rubric',
    val: '<p style="color:#000000; "><span style="font-weight:bold; ">Exemplar:</span> </p><p style="color:#000000; ">&#xA0;</p><p style="color:#000000; ">For this item, a full-credit response includes</p><p style="color:#000000; ">&#xA0;</p><ul style="padding-left:1.5000em; "><li><p style="color:#000000; ">The student enters a valid equation for Part A ( &#xA0;,5 + 2 + 4 + 7 +<span style="font-style:normal; "> 9 </span>+ <span style="font-style:italic; ">n</span> =36, 5 + 4 =<span style="font-style:italic; ">n</span> or equivalent equations) and enters the correct area for Part B (73). (1 point)&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;</p></li></ul><ul style="padding-left:1.5000em; "><li><p style="color:#000000; ">The student enters a valid equation for Part A or enters the correct area for Part B. &#xA0;(2 point)</p></li></ul>'
  }]
},
  {
  itemId: 2,
  list: [{
    name: 'Rubric',
    val: '<p style="">Exemplar:</p><p style="">&#xA0;</p><ul style="padding-left:1.5000em; "><li><p style="font-style:italic; font-weight:bold; ">Part A: </p><ul style="padding-left:1.5000em; "><li><p style="">Radius = 2 in&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;Radius = 4 in</p><p style="">Volume = <img id="item_2029_Object1" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAFAAAABQD3kNM4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAAAkAAAAMABWqczaAAAB/UlEQVRYw72X4bHaMBCEP25ogJTgFkgJpoS8EtzCSwm8EqAEKAFKCC24BNzBkh8+gVAw+FkiO6MZgzVe3Xlv7zyTxDOY2Q5YSFqRifkLog3wK5fk+rwnRGugKUU0SGZmDfAJbIFjMTZJdwuogQvwB1gAB+CS7puy7iIzsyWwA1pgJal7SxrNbOFEAB+licDV6EQHoPKITqWJrmTA0tcJqM2sjvZUfqC1/95KaiexJaIYs+qpAplJCmlcDpxn7feCg5ymvs/ZCLs6eDSzzFc27CDvwH8le5nGkpjnP+IG99Rq4HZbjMzb0bMucSzyzswsRPODvkusXL1fwJekmaTVPHGL7yCtt9+SOjNDUmhLwZWuGOsco5wEOEfXh3jfvESxJulcDN4vReRo+LezByOvS6qx4jZK3B0gRFyyzsIUto/+29I35Ar4KOogZlalvc6j6iR1d2TuALWfJLSck592mzsqpGQXv2x94eTQ19XPrNCTGtmQ1I9HeCazS0ti3CafHXPJXtaZjwwV0EWpnYSH0o9mkppe0gt678siG0pbPG2dgabE+P2wzpLIKo/uSO6kPFIgO4/y860CcQRzrUbuf4ixZIEky0Hir5jmUdf29xdmi6wPjlj6FbAxs5Y+bR295IP095L236eIkNjSjps1xdJfv036nr4aaLMLOcJfHOycoWxtv0EAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="27" height="40" />8 in<span style="vertical-align:super; font-size: 58%;">3</span>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;Volume = <img id="item_2029_Object2" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAFAAAABQD3kNM4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAAAkAAAAMABWqczaAAAB/UlEQVRYw72X4bHaMBCEP25ogJTgFkgJpoS8EtzCSwm8EqAEKAFKCC24BNzBkh8+gVAw+FkiO6MZgzVe3Xlv7zyTxDOY2Q5YSFqRifkLog3wK5fk+rwnRGugKUU0SGZmDfAJbIFjMTZJdwuogQvwB1gAB+CS7puy7iIzsyWwA1pgJal7SxrNbOFEAB+licDV6EQHoPKITqWJrmTA0tcJqM2sjvZUfqC1/95KaiexJaIYs+qpAplJCmlcDpxn7feCg5ymvs/ZCLs6eDSzzFc27CDvwH8le5nGkpjnP+IG99Rq4HZbjMzb0bMucSzyzswsRPODvkusXL1fwJekmaTVPHGL7yCtt9+SOjNDUmhLwZWuGOsco5wEOEfXh3jfvESxJulcDN4vReRo+LezByOvS6qx4jZK3B0gRFyyzsIUto/+29I35Ar4KOogZlalvc6j6iR1d2TuALWfJLSck592mzsqpGQXv2x94eTQ19XPrNCTGtmQ1I9HeCazS0ti3CafHXPJXtaZjwwV0EWpnYSH0o9mkppe0gt678siG0pbPG2dgabE+P2wzpLIKo/uSO6kPFIgO4/y860CcQRzrUbuf4ixZIEky0Hir5jmUdf29xdmi6wPjlj6FbAxs5Y+bR295IP095L236eIkNjSjps1xdJfv036nr4aaLMLOcJfHOycoWxtv0EAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="27" height="40" />64 in<span style="vertical-align:super; font-size: 58%;">3</span></p><p style="">&#xA0;</p></li></ul></li><ul style="padding-left:1.5000em; "><li><p style="">Radius = 2 in&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;Radius = 4 in</p><p style="">Volume = <img id="item_2029_Object1" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAFAAAABQD3kNM4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAAAkAAAAMABWqczaAAAB/UlEQVRYw72X4bHaMBCEP25ogJTgFkgJpoS8EtzCSwm8EqAEKAFKCC24BNzBkh8+gVAw+FkiO6MZgzVe3Xlv7zyTxDOY2Q5YSFqRifkLog3wK5fk+rwnRGugKUU0SGZmDfAJbIFjMTZJdwuogQvwB1gAB+CS7puy7iIzsyWwA1pgJal7SxrNbOFEAB+licDV6EQHoPKITqWJrmTA0tcJqM2sjvZUfqC1/95KaiexJaIYs+qpAplJCmlcDpxn7feCg5ymvs/ZCLs6eDSzzFc27CDvwH8le5nGkpjnP+IG99Rq4HZbjMzb0bMucSzyzswsRPODvkusXL1fwJekmaTVPHGL7yCtt9+SOjNDUmhLwZWuGOsco5wEOEfXh3jfvESxJulcDN4vReRo+LezByOvS6qx4jZK3B0gRFyyzsIUto/+29I35Ar4KOogZlalvc6j6iR1d2TuALWfJLSck592mzsqpGQXv2x94eTQ19XPrNCTGtmQ1I9HeCazS0ti3CafHXPJXtaZjwwV0EWpnYSH0o9mkppe0gt678siG0pbPG2dgabE+P2wzpLIKo/uSO6kPFIgO4/y860CcQRzrUbuf4ixZIEky0Hir5jmUdf29xdmi6wPjlj6FbAxs5Y+bR295IP095L236eIkNjSjps1xdJfv036nr4aaLMLOcJfHOycoWxtv0EAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="27" height="40" />8 in<span style="vertical-align:super; font-size: 58%;">3</span>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;Volume = <img id="item_2029_Object2" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAFAAAABQD3kNM4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAAAkAAAAMABWqczaAAAB/UlEQVRYw72X4bHaMBCEP25ogJTgFkgJpoS8EtzCSwm8EqAEKAFKCC24BNzBkh8+gVAw+FkiO6MZgzVe3Xlv7zyTxDOY2Q5YSFqRifkLog3wK5fk+rwnRGugKUU0SGZmDfAJbIFjMTZJdwuogQvwB1gAB+CS7puy7iIzsyWwA1pgJal7SxrNbOFEAB+licDV6EQHoPKITqWJrmTA0tcJqM2sjvZUfqC1/95KaiexJaIYs+qpAplJCmlcDpxn7feCg5ymvs/ZCLs6eDSzzFc27CDvwH8le5nGkpjnP+IG99Rq4HZbjMzb0bMucSzyzswsRPODvkusXL1fwJekmaTVPHGL7yCtt9+SOjNDUmhLwZWuGOsco5wEOEfXh3jfvESxJulcDN4vReRo+LezByOvS6qx4jZK3B0gRFyyzsIUto/+29I35Ar4KOogZlalvc6j6iR1d2TuALWfJLSck592mzsqpGQXv2x94eTQ19XPrNCTGtmQ1I9HeCazS0ti3CafHXPJXtaZjwwV0EWpnYSH0o9mkppe0gt678siG0pbPG2dgabE+P2wzpLIKo/uSO6kPFIgO4/y860CcQRzrUbuf4ixZIEky0Hir5jmUdf29xdmi6wPjlj6FbAxs5Y+bR295IP095L236eIkNjSjps1xdJfv036nr4aaLMLOcJfHOycoWxtv0EAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="27" height="40" />64 in<span style="vertical-align:super; font-size: 58%;">3</span></p><p style="">&#xA0;</p></li></ul><li><p style="margin-left:0in; margin-right:0in; text-indent:0in; "><span style="font-style:italic; font-weight:bold; ">Part B:</span> False</p></li></ul><p style="margin-left:0in; margin-right:0in; text-indent:0in; ">&#xA0;</p><p style="margin-left:0in; margin-right:0in; text-indent:0in; ">(1 point) The student supplies an example of two radii and missing numbers for the volumes that makes the conjecture false (e.g. Radii are 1 and 2, missing numbers for volume are 1 and 8; radii are 2 and 4, missing numbers for volume are 8 and 64; etc.) and responds with “False” in Part B.</p><p style="">&#xA0;</p>'
  }]
},
  {
  itemId: 3,
    list: [{
      name: 'Rubric',
      val: '<p style="">Exemplar:</p><p style="">&#xA0;</p><ul style="padding-left:1.5000em; "><li><p style=""><img id="item_1889_Object9" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAANCAYAAAA+AemEAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAEAAAABAAl1zHcAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAABYAAAAFADboeDGAAAB/UlEQVRYw9WW23HiQBBFD7dIQCmQAhuCCAGHACFACCIESIEQrBBMCBDCKoNb+6Ge9VgrbPEy3v4Z1bx053RP94xs8xNM0gqogF+2D8/WM1j3swVkNgX4n+DBzwNYP1vEpTZKV1jSHCiBSTa+t717tAhJBfAb2AAnYP6d/x+ocQosMj41sBtnc1ZAEQNNHGIrqbG9f7C+MtpFtAfaiCwl8WyIkhbAlta5h4BYAUUOcJnnH0k74BgHeTTAabQ7YGO7CY+/0TryA8AYq77a1PbsDvDmAW9ne5n1l0DzF6Dtg6RJ0C2zPZozG09sn+4I8GR73dFzbv8T7XX/DqtC2zLvtF0DjDOaFe+R0GTg/qmKAfooaW17k/VfGxklnSgLmwSs7vqGKwuOpNcB09adgDrrrHHAew1QLynfSdoCi0S6c4CTpH3PIS6OjICe1ub9KVn3ObDg3dlnrU/7QH1JS14w+gHSJu4GmIVnk336rLD90tN3TWSkdNFdlwrKuchcDdi7z/mX6Cu+mjCOSU2CF95dBcDvyDOTOFhewBahYd+XZ2PuzQVigKWAWpA5I25tYXs/pg3XUtIxffNJ/nuAlSHqGP8rou8ALG/Y92azXUuqgbmkt4BY0gbXDGAUgis+3veaeD7csdL2mqSK1nHTTMOBeM48E2Doy28kobVOteIPop3oKMZxLOMAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="80" height="13" /></p><p style=""><img id="item_1889_Object10" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAANCAYAAAA+AemEAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAEAAAABAAl1zHcAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAABYAAAAFADboeDGAAAB/UlEQVRYw9WW23HiQBBFD7dIQCmQAhuCCAGHACFACCIESIEQrBBMCBDCKoNb+6Ge9VgrbPEy3v4Z1bx053RP94xs8xNM0gqogF+2D8/WM1j3swVkNgX4n+DBzwNYP1vEpTZKV1jSHCiBSTa+t717tAhJBfAb2AAnYP6d/x+ocQosMj41sBtnc1ZAEQNNHGIrqbG9f7C+MtpFtAfaiCwl8WyIkhbAlta5h4BYAUUOcJnnH0k74BgHeTTAabQ7YGO7CY+/0TryA8AYq77a1PbsDvDmAW9ne5n1l0DzF6Dtg6RJ0C2zPZozG09sn+4I8GR73dFzbv8T7XX/DqtC2zLvtF0DjDOaFe+R0GTg/qmKAfooaW17k/VfGxklnSgLmwSs7vqGKwuOpNcB09adgDrrrHHAew1QLynfSdoCi0S6c4CTpH3PIS6OjICe1ub9KVn3ObDg3dlnrU/7QH1JS14w+gHSJu4GmIVnk336rLD90tN3TWSkdNFdlwrKuchcDdi7z/mX6Cu+mjCOSU2CF95dBcDvyDOTOFhewBahYd+XZ2PuzQVigKWAWpA5I25tYXs/pg3XUtIxffNJ/nuAlSHqGP8rou8ALG/Y92azXUuqgbmkt4BY0gbXDGAUgis+3veaeD7csdL2mqSK1nHTTMOBeM48E2Doy28kobVOteIPop3oKMZxLOMAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="80" height="13" /></p><p style=""><img id="item_1889_Object11" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAEAAAABgAX4VNeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAABIAAAAKQCyn6rjAAACRUlEQVRo3tWZ4XGjMBCFP++kAVyCUwJXAldCUgIpAUqwSzAl2CWEEuwS4hLiDt7cDwlH59yNMSIWvBmNR8ISvEW7+7QsJBELM8uA3HdPkk7Riz4INgL5NfAJvPv2YWbb1MT64imS/BYogRrY++ESWKUm1heLoS5gZiWwBWpJm6trmaRzanJ3GcDMciC78f+Lf5vZDsglPacmEYPQBXJub90W6ALci+/PGhcDSGoGzD+mJhCL2CxQfFvQrBiy0BwNsAFyM9uZ2YuZrc3sA+cas0FMFsiANS7tAZxxqbCRNCnXCITayrcT0Eo6DTbAnBDolWu8RgmhiAfqI5aaESX1EfjV7Uyf8g9AkcQAj0aY4a6C9HmBEz/53av2x3EsVdhz57SS2mBOBlS44Hw99+3JD1Y/aICaRHrBkz/gXnLDl5ArPec2SRD0J8hbu66OzSb+PhWB//vxHVBIWiaJAZLqB90q9/cLyRc4AddC5HF4BmiBwswOuK2/IijcwAgFkYmj8S3zrQVe/e8eIpRgBzOrcP70OzXbQc8/whqz0v6jGiDQ2JPS/vcgNgheAkoQXWFcGTtpA3SEK/5WWaWZPc+hLhgbA7odsAeWkhY45Zfx79PX5DCGAfaS6uBtd+XxWwXWSeDiAvceNIIq8nUAnAXxbwbwRG4FrvB6HswLsfrP+CQRUxLbAqX3+3D8Hfe9YJmaXC8eEXMvB4qAfOnHN4NWTIBBO8ALoE/f7VynO2g0kt5SE/tpA6xwae7EV7X1jAuSQz6wJMMfS5nXzBbz4VUAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="64" height="32" /></p><p style=""><img id="item_1889_Object12" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAgCAYAAACl36CRAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAEAAAABgAX4VNeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAABIAAAAKQCyn6rjAAACQklEQVRYw92Z4XHiMBCFP3ZogJTAlWBKICWQEpISoAQoAZeAS8AlJCXELdDBm/uh1cXxwNnYgG3eDIMtC8lP2n27WiaSuAXMbOmXJ0lfNxn0zph0JW9m78AWmJWaC0l/+iZX++43IL4HMmABvAAffZNqitY7b2Zz4BvIJL1Vns0knfomV4dphcy8pn/Zn9/9e1PtNAbiv8g78WVN/wKI5BNfjKJvEm3RxeyPAJJe+ybRFp0ED0jMrKzy5ZA3eEw7/DYjuMnBzDJCqFsS3GfwYQ46xnkz2xKEL+5+RlD/rG9ilfeMmzIn6FYuqeic5AwdvkHrM4/euph925eZ8xMmL0LSpsFwTVAAixiiS/nJ+8PJPxqS0nhtZgnBRQvgNPGb5E5zF7fMA9yE65DGOT0SrQlCXOW4mxJEYN1g0DbIgLTzKO0WagYcnV9KyEQLX4g9kD9c8Nz0anewa/JkZmuf51VSXmrfAmtJk4f7vAvPI7LCaOb/agse8laxrWuGN2RE0p9mdjCzT+BAcIP82cmn/OjNzBfjw4nncEWG574ykzSaYkUtpyv63isiDJt86aQ22rP7OTRV+6icudftYsVnN5aqzS3I7/mdKa0YyfH1HJr6fAKcCCr5ImlCyN7mYypeXE2+VNhMJW1KZh7DyPOSL5HLLzwfrQg2IR/FrfoXVHKhfTSoTXI8LUTSotL+7e1PLXgJFZM3sz3BIm5VbekF/915V/Kj3375JxYDN5J2fRO4N/mlk14RDggngvLnjWYYMP4CpEHR/uDT+sQAAAAnelRYdFNvZnR3YXJlAAB42nN0C/BRcM/ILy4pTi7KLChRsNAzNQEATLQGzd4UKKMAAAAASUVORK5CYII=" width="63" height="32" /></p></li></ul><p style="">&#xA0;</p><p style="">Other Correct Responses:</p><p style="">&#xA0;</p><ul style="padding-left:1.5000em; "><li><p style="">for the second equation, <img id="item_1889_Object13" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAANCAYAAAA+AemEAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAFAAAABADui+J5AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAABYAAAAFADboeDGAAACAUlEQVRYw81X/1GzUBDcvEkDpAQsAUvAErQELAFLSEqQFmghJUgJUoJ0sN/3x9vTmzeQ+Mgo7gx/8Lgce3u/yI4k/gJCCK8AGpK7rblk8d6agEMN4Lw1iVz8CQFDCAWAEsCwNZdc7G8I+qigCx2NADqSa0SozYf8VrrvSPZbi6R4awCPinlC7JZ+t2YGhhAqAG9yMkjEBsBE8rDC3xFAK2ITYjJM1DuS48bivSq+QVctIR/WVuAI4EByci+ZALQhhJpk7iyrJNyJ5En+GgBG/CUJqEGshksYSL7gRii5DYBnkp07bwEMqyrQOakQM1HpqlNhve1Se4cQPgCcST4l5/8kaipgqfdewrRynPj3FADeEZPxMGezX5NNlxU//woA44J4LYBjCOE+DUpJKJAsEJ3PQi2d3dbyebxm58Sqxa1bst0jzrFrZHyr2rw6AehNEKuihd+fvW0CEyp9Vi6c31KBo3h/F0vcvgRckc0WcTv6irQqmvWjQJ4W/FWyScV/lAhzW9g24iXYwPc8bHvmYlp6kLVEXFv5iiwlqpHORZUG5cbK7BLQMO+uu74ZFmcDV7niN5DMXyJqVT+zPmdV7t8wDekP3Q6IFWxLqSP5/AsiXeP3Jk69BLVPmAPJaY2AFWLFWcv2cgi/5r/pq0TMrn332VLqc339oIjWYX4mf87z/xpv+G5VGaOoAAAAJ3pUWHRTb2Z0d2FyZQAAeNpzdAvwUXDPyC8uKU4uyiwoUbDQMzUBAEy0Bs3eFCijAAAAAElFTkSuQmCC" width="80" height="13" /></p><p style="">for the fourth equation, <img id="item_1889_Object14" style="vertical-align:middle;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABmJLR0QA/wD/AP+gvaeTAAAACW9GRnMAAAAEAAAABgAX4VNeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAACXZwQWcAAABIAAAAKQCyn6rjAAACPUlEQVRo3t2Z4XHiMBCFP3bSAJTglOCUYEogJZgSoISkhLiEcwlxCbiEcwlHBzv3Q2vQkWEs24DQvRkPljyS/Na7T6tloaqMgYjkwBJAVZtRg58Qi1ADGPEvIPe6j8BaVdvYRKZCRpD/tuZaVRfAO9DFJjAXQR4gIr/t9k1Vj17/0m+niJcA8jmQAdtLsqmTh7AQ2Nhv8u4+1QDA/6H4swwgIpuLdiYiWWwCczEogkbyYM1P3NaXAyXwqqpJh0boLrABPnBiCNACtap+xiYQAhFZ4j5aZlcHNKraBSdCKUNEvnAee4n3wW3wTi9Ucvama6huGF4tLodpbf0cF9ZFFAM8Gqpa9fciUniPjgvcwSYfPWs42lslTIGe0/hbtsX/DpfPXI7dvljn7o4G2ONc8OEw8gfcR66ABieApXFuooigiHww7HX7uadMW2eHF//W/wsoVHUVRQNUdf+gpXJbzydfAAXOG4YPQ4mjAQoROeBcP+PseR2MSIUTRWXX0q4GV8dogBpGVISuQUR2uHhax2Y76f1vMMdm/hSJGsDLsZOtCc4VwZOgeOoKt01jn9oAPeEd/2ZZpYi8plAym6sBvQfUwMqqxXuc4paTZ03MALWq7r2vXdvvMja5EJxCYOxBw/uH6FIAkyD+wwBGZEi4/Oe5N85HdqX/KTE5EeqrLBb3fv83kKvqKja5IB4zxp4OFB750vqTqBXCRA+wBOiPNfvQ6Q8alapuYxO7twEy3DbXca62HnEiWY2eMCL+AlKX3bcRPeuFAAAAJ3pUWHRTb2Z0d2FyZQAAeNpzdAvwUXDPyC8uKU4uyiwoUbDQMzUBAEy0Bs3eFCijAAAAAElFTkSuQmCC" width="64" height="32" /></p></li></ul><p style="">&#xA0;</p><p style="">For this item, a full-credit response includes</p><p style="">&#xA0;</p><ul style="padding-left:1.5000em; "><li><p style=""><span style="background-color:transparent; ">two correct equations </span>(1 point)</p></li></ul><p style="">&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;AND</p><ul style="padding-left:1.5000em; "><li><p style="language:es; country:ES; background-color:transparent; ">two more correct equations (1 point).</p></li></ul>'
    }]
},
  {
  itemId: 4,
    list: [{
      scorepoint: 4,
      name: 'Rubric 4',
      val: '<p style="">&#xA0;</p><p><dl><dt style="float: left; margin-top: 1px; margin-bottom: -1em;">a)</dt><dd style="float: top;padding-left:1.5000em; padding-left:1.5000em; "><p style="font-style:normal; font-weight:normal; ">Inference here.</p></dd><dt style="float: left; margin-top: 1px; margin-bottom: -1em;">b)</dt><dd style="float: top;padding-left:1.5000em; padding-left:1.5000em; "><p style="font-style:normal; font-weight:normal; ">Text-supported example: “....” (paragraph reference)</p></dd><dt style="float: left; margin-top: 1px; margin-bottom: -1em;">c)</dt><dd style="float: top;padding-left:1.5000em; padding-left:1.5000em; "><p style="font-style:normal; font-weight:normal; ">Inference here.</p></dd><dt style="float: left; margin-top: 1px; margin-bottom: -1em;">d)</dt><dd style="float: top;padding-left:1.5000em; padding-left:1.5000em; "><p style="font-style:normal; font-weight:normal; ">Text-supported example: “....” (paragraph reference)</p></dd></dl></p>',
      samplelist: [{
        minval: 4,
        maxval: 4,
        name: '4-Point Other Official Sample Answers',
        content: '<p style="">&#xA0;</p>'
      }]}, {
      scorepoint: 3,
      name: 'Rubric 3',
      val: '<p style="">&#xA0;</p>',
      samplelist: [{
        minval: 3,
        maxval: 3,
        name: '3-Point Official Sample Answer',
        content: '<p style="">&#xA0;</p>'
      }]
    }, {
      scorepoint: 2,
      name: 'Rubric 2',
      val: '<p style="">Response provides an adequate explanation of how information in Source #1 refutes information in Source #2 and appropriately paraphrases both sources involved while avoiding plagiarism.<br />Key Elements:<br />Source #1 (Working Financial Literacy in With the Three R\'s)<br />- Students in Matthew Frost\'s American history and economics class reported that they had positive outcomes from participating in the personal finance portion of this course. One student said he learned about the importance of budgeting money. Another student reported that the class prompted her to open a Roth I.R.A. <br />-A study conducted by a professor at the University of Florida found that students who were required to take financial literacy classes in high school were more likely to budget and save their money, and less likely to accrue credit card debt.<br />Source #2 (Financial Education Leaving Americans Behind)<br />-There is evidence that financial literacy courses don\'t work and can potentially even harm the students who take them by making them overconfident in their ability to make good financial decisions.<br />-Willis says that financial literacy classes can actually keep people from attaining their financial literacy goals. She cites examples of students whose financial literacy skills stayed the same or decreased after taking financial literacy classes. <br />-A Harvard Business School study concluded that common financial literacy programs used in the past two decades did not alter the choices participants made about their finances.</p>',
      samplelist: [{
        minval: 2,
        maxval: 2,
        name: '2-Point Official Sample Answer',
        content: '<p style="">According to Source #2, financial literacy classes are ineffective and can even harm the people who participate in them by making them overconfident in their ability to make good financial decisions. Source #1 refutes this information. It includes a study conducted by a professor at the University of Florida that found students who were required to take financial literacy classes in high school were more likely to budget and save their money and less likely to accrue credit card debt. This refutes the information in Source #2 because it is concrete evidence that financial literacy classes can be effective.</p>'
      }]
    },{
      scorepoint: 1,
      name: 'Rubric 1',
      val: '<p style="">The response provides a limited/partial explanation of how information in Source #1 refutes information in Source #2 and appropriately paraphrases both sources involved while avoiding plagiarism. <br />OR <br />The response provides an adequate explanation of how information in Source #1 refutes information in Source #2, but does not appropriately paraphrase all sources involved.</p>',
      samplelist: [{
        minval: 1,
        maxval: 1,
        name: '1-Point Official Sample Answer',
        content: '<p style="">According to Source #2, financial literacy classes are ineffective and can even harm the people who participate in them by making them overconfident in their ability to make good financial decisions. Source #1 refutes this information. It includes a study conducted by a professor at the University of Florida that found students who were required to take financial literacy classes in high school were more likely to budget and save their money, and less likely to accrue credit card debt.</p>'
      }]
    },{
      scorepoint: 0,
      name: 'Rubric 0',
      val: '<p style="">Response is an explanation that is incorrect, irrelevant, or blank.</p>',
      samplelist: [{
        minval: 0,
        maxval: 0,
        name: '0-Point Official Sample Answer',
        content: '<p style="">According to Source #2, financial literacy classes are ineffective.</p>'
      }]
    }

    ]
  }
]
