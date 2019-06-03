export interface Sandbox {
  label: string;
  key: string;
  baseUrl: string;
  roles: Role[];
}

export interface Role {
  id: string;
  label: string;
}
