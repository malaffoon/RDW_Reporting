export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly permissions: string[];
  readonly anonymous?: boolean;
  readonly tenantName?: string;
  readonly logoutUrl?: string;
  readonly sessionRefreshUrl?: string;
  readonly sandboxUser?: boolean;
}
