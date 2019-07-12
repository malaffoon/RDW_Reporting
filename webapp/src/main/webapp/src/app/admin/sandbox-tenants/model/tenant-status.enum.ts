export enum TenantStatus {
  Started = 'STARTED',
  CreatingDatabases = 'CREATING_DATABASES',
  PersistingConfiguration = 'PERSISTING_CONFIGURATION',
  NotifyingConfigServer = 'NOTIFYING_CONFIG_SERVER',
  Failed = 'FAILED',
  Active = 'ACTIVE'
}
