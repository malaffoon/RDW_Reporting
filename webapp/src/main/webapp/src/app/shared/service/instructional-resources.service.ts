import { Injectable } from '@angular/core';
import { ResponseUtils } from '../response-utils';
import { Observable } from 'rxjs';
import {
  InstructionalResource,
  InstructionalResources
} from '../model/instructional-resource';
import { catchError, map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../service-route';
import { CachingDataService } from '../data/caching-data.service';

const ResourceRoute = `${ReportingServiceRoute}/instructional-resources`;

function toRequestParameters(assessmentId: number, schoolId: number) {
  return schoolId == null
    ? {
        assessmentId: assessmentId
      }
    : {
        assessmentId: assessmentId,
        schoolId: schoolId
      };
}

function toInstructionalResource(serverResource: any): InstructionalResource {
  return {
    organizationLevel: serverResource.organizationLevel,
    organizationName: serverResource.organizationName,
    performanceLevel: serverResource.performanceLevel.toString(),
    url: serverResource.resource
  };
}

function toInstructionalResources(
  serverResources: any[]
): InstructionalResources {
  const resourcesById = new Map<number, InstructionalResource[]>();
  for (const serverResource of serverResources) {
    const resource = toInstructionalResource(serverResource);
    const resources = resourcesById.get(serverResource.performanceLevel);
    if (resources == null) {
      resourcesById.set(serverResource.performanceLevel, [resource]);
    } else {
      resources.push(resource);
    }
  }
  return new InstructionalResources(resourcesById);
}

@Injectable()
export class InstructionalResourcesService {
  constructor(private dataService: CachingDataService) {}

  getInstructionalResources(
    assessmentId: number,
    schoolId: number
  ): Observable<InstructionalResources> {
    return this.dataService
      .get(ResourceRoute, {
        params: toRequestParameters(assessmentId, schoolId)
      })
      .pipe(
        catchError(ResponseUtils.badResponseToNull),
        map(instructionalResources => {
          return !instructionalResources || instructionalResources.length === 0
            ? new InstructionalResources()
            : toInstructionalResources(instructionalResources);
        })
      );
  }
}
