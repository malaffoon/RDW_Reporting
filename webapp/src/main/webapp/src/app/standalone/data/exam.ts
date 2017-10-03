/*
 examination
 exam
 id...
 admin
 date...

 taker
 performance...
 */

// export const exam = {
//   metadata: {
//     id: 1,
//     subject: "ELA",
//     type: "ICA",
//     period: "2015 - 2016",
//     grade: 4,
//     score: {
//       range: {
//         minimum: 1200,
//         maximum: 2400
//       },
//       cut_points: [
//         1400,
//         1800,
//         2100,
//         2400 // redundant
//       ],
//     }
//   },
//   location: {
//     state: {
//       name: "California"
//     },
//     createDistrict: {
//       name: "Daybreak School District"
//     },
//     institution: {
//       name: "Daybreak - Western Elementary"
//     }
//   },
//   administration: {
//     date: new Date(),
//     standardized: true,
//     valid: false
//   },
//   taker: {
//     name: "Anna Martin",
//     accommodations: [
//       0,
//       1,
//       2,
//       3,
//       4,
//       5,
//       6,
//       7,
//       8
//     ],
//     performance: {
//       level: 2,
//       complete: false,
//       score: {
//         value: 1906,
//         range: {
//           minimum: 1862,
//           maximum: 1950,
//         }
//       },
//       claims: [
//         {
//           id: 3,
//           performance: 0
//         },
//         {
//           id: 4,
//           performance: 1
//         },
//         {
//           id: 5,
//           performance: 2
//         },
//         {
//           id: 6,
//           performance: 1
//         }
//       ]
//     }
//   }
// };

export const exam = {
  "metadata": {
    "id": "72d8248d-0e8f-404b-8763-a5b7bcdaf535",
    "subject": "ELA",
    "type": "INTERIM COMPREHENSIVE",
    "period": "Fall 2014",
    "date": "07-03-2014",
    "grade": "03",
    "location": {
      "state": "CA",
      "district": "Sunset School District",
      "institution": "Sunset - Eastern Elementary"
    },
    "score": {
      "minimum": 1200,
      "maximum": 2400,
      "cutPoints": [
        1400,
        1800,
        2100,
        0
      ]
    }
  },
  "student": {
    "name": "Thomas Roccos Lavalleys",
    "accommodations": [
      1,
      3,
      5,
      7
    ],
    "performance": {
      "level": 2,
      "valid": true,
      "complete": true,
      "score": {
        "value": 1475,
        "range_min": 1338,
        "range_max": 1584
      },
      "claims": [
        {
          "id": 0,
          "performance": 1386
        },
        {
          "id": 1,
          "performance": 1469
        },
        {
          "id": 2,
          "performance": 1573
        },
        {
          "id": 3,
          "performance": 1411
        }
      ]
    }
  },
  "confidence": ""
};


