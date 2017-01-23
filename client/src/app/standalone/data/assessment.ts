/*
 examination
 exam
 id...
 admin
 date...

 taker
 performance...
 */

export const assessment = {
  metadata: {
    id: 1,
    subject: "ELA",
    type: "ICA",
    period: "2015 - 2016",
    grade: 4,
    score: {
      range: {
        minimum: 1200,
        maximum: 2400
      },
      cut_points: [
        1400,
        1800,
        2100,
        2400 // redundant
      ],
    }
  },
  location: {
    state: {
      name: "California"
    },
    district: {
      name: "Daybreak School District"
    },
    institution: {
      name: "Daybreak - Western Elementary"
    }
  },
  administration: {
    date: new Date(),
    standardized: true,
    valid: false
  },
  taker: {
    name: "Anna Martin",
    accommodations: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    performance: {
      level: 2,
      complete: false,
      score: {
        value: 1906,
        range: {
          minimum: 1862,
          maximum: 1950,
        }
      },
      claims: [
        {
          id: 3,
          performance: 0
        },
        {
          id: 4,
          performance: 1
        },
        {
          id: 5,
          performance: 2
        },
        {
          id: 6,
          performance: 1
        }
      ]
    }
  }
};



