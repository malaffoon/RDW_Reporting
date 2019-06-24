import { SecuritySettings } from './security-settings';
import { Observable } from 'rxjs';

/**
 * Implement and provide this to supply security settings to the security service
 */
export abstract class SecuritySettingService {
  abstract getSettings(): Observable<SecuritySettings>;
}
