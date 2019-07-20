export interface Property {
  key: string;
  defaultValue: any;
}

export interface ConfigurationProperty extends Property {
  required?: boolean;
  password?: boolean;
  encrypted?: boolean;
  lowercase?: boolean;
}
