import { Field } from './field';

export interface Property {
  key: string;
  defaultValue: any;
}

export interface ConfigurationProperty extends Property, Field {
  required?: boolean;
  /** @deprecated use dataType */
  password?: boolean;
  /** @deprecated use inputType string:lowercase */
  lowercase?: boolean;
}
