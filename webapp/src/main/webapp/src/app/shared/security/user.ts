export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly permissions: string[];
  readonly anonymous?: boolean;
  readonly logoutUrl?: string;
  readonly sessionRefreshUrl?: string;
}
