export interface InstructionalResource {
  organizationLevel: string;
  organizationName: string;
  performanceLevel: string;
  url: string;
}

export class InstructionalResources {
  resourcesByPerformanceLevel: Map<number, InstructionalResource[]>;

  getResourcesByPerformance(performanceLevel: number): InstructionalResource[] {
    return this.resourcesByPerformanceLevel.get(performanceLevel) || [];
  }

  constructor(
    instructionalResourcesMap: Map<number, InstructionalResource[]> = new Map()
  ) {
    this.resourcesByPerformanceLevel = instructionalResourcesMap;
  }
}
