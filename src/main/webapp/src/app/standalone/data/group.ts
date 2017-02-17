import {exams} from './exams'
import {randomId} from "./support/generator";

export const group = {
  id: randomId(),
  name: 'Anderson, Mary 4th Grade Math Noon',
  students: [
    {
      id: randomId(),
      firstName: "David",
      lastName: "Hayden",
      exams: exams
    },
    {
      id: randomId(),
      firstName: "Clementine",
      lastName: "Roach"
    },
    {
      id: randomId(),
      firstName: "Hasad",
      lastName: "Valenzuela"
    },
    {
      id: randomId(),
      firstName: "Joe",
      lastName: "Smith"
    },
    {
      id: randomId(),
      firstName: "Joseph",
      lastName: "Cleveland"
    },
    {
      id: randomId(),
      firstName: "Sara",
      lastName: "Blankenship"
    },
    {
      id: randomId(),
      firstName: "Linus",
      lastName: "Todd"
    },
    {
      id: randomId(),
      firstName: "Hope",
      lastName: "Cardinas"
    }
  ]
};
