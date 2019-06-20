import { AbstractStore } from '../../../shared/store/abstract-store';
import { Injectable } from '@angular/core';
import { TenantConfiguration } from '../model/tenant-configuration';

@Injectable({
  providedIn: 'root'
})
export class TenantStore extends AbstractStore<TenantConfiguration[]> {
  constructor() {
    super(undefined);
  }
}
