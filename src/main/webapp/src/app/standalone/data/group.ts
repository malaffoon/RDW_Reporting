import {exams} from "./exams";
import {randomId, randomSsid} from "./support/generator";
import {sortAscOn} from "../../shared/comparators";

export const group = {
  id: randomId(),
  name: 'Anderson, Mary 4th Grade Math Noon',
  exams: exams,
  students: sortAscOn([
    {
      firstName: "David",
      lastName: "Hayden"
    },
    {
      firstName: "Clementine",
      lastName: "Roach"
    },
    {
      firstName: "Hasad",
      lastName: "Valenzuela"
    },
    {
      firstName: "Joe",
      lastName: "Smith"
    },
    {
      firstName: "Joseph",
      lastName: "Cleveland"
    },
    {
      firstName: "Sara",
      lastName: "Blankenship"
    },
    {
      firstName: "Linus",
      lastName: "Todd"
    },
    {
      firstName: "Hope",
      lastName: "Cardinas"
    }
  ].map((student: any) => {
    student.id = randomId();
    student.ssid = randomSsid();
    student.exams = exams;
    return student;
  }),student => student.lastName, student => student.firstName)
};
