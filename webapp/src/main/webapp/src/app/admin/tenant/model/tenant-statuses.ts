import { TenantStatus } from './tenant-status';

const completedPattern = /(^ACTIVE$|\w+_FAILED$)/;

export function completed(status: TenantStatus): boolean {
  return completedPattern.test(status || '');
}
