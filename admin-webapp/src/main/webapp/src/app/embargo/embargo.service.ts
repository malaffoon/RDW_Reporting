import { Observable } from "rxjs/Observable";
import { Embargo, EmbargoSettings } from "./embargo-settings";

export class EmbargoService {

  getEmbargoSettings(): Observable<EmbargoSettings> {
    return Observable.of({
      stateEmbargo: {
        individualEmbargoed: false,
        aggregateEmbargoed: true,
        organization: {
          id: 0,
          name: 'California'
        },
        examCountsBySubject: {
          ELA: 20000,
          Math: 19000
        }
      },
      districtEmbargoes: [
        {
          individualEmbargoed: false,
          aggregateEmbargoed: false,
          organization: {
            id: 1,
            name: 'San Diego Unified'
          },
          examCountsBySubject: {
            ELA: 20000,
            Math: 19000
          }
        },
        {
          individualEmbargoed: false,
          aggregateEmbargoed: false,
          organization: {
            id: 2,
            name: 'Chula Vista Unified'
          },
          examCountsBySubject: {
            ELA: 20000,
            Math: 19000
          }
        },
        {
          individualEmbargoed: true,
          aggregateEmbargoed: false,
          organization: {
            id: 3,
            name: 'Clairemont Mesa Unified'
          },
          examCountsBySubject: {
            ELA: 20000,
            Math: 19000
          }
        },
        {
          individualEmbargoed: false,
          aggregateEmbargoed: true,
          organization: {
            id: 4,
            name: 'Mira Mesa Unified'
          },
          examCountsBySubject: {
            ELA: 20000,
            Math: 19000
          }
        },
        {
          individualEmbargoed: true,
          aggregateEmbargoed: true,
          organization: {
            id: 5,
            name: 'Coronodo Unified'
          },
          examCountsBySubject: {
            ELA: 20000,
            Math: 19000
          }
        }
      ]
    });
  }

}
