import { ConfigurationProperty, Property } from './property';

// TODO have metadata mappings for each prop
const requiredFields = ['username', 'password'];
const passwordFields = ['password'];
const encryptedFields = ['password', 's3SecretKey'];
// These fields should be lowercase for consistency with existing usernames and schema names in the database
const lowercaseFields = ['urlParts.database', 'username'];

export function toProperty(key: string, defaultValue: any): Property {
  return {
    key,
    defaultValue
  };
}

export function toConfigurationProperty(
  key: string,
  defaultValue: any
): ConfigurationProperty {
  return {
    ...toProperty(key, defaultValue),
    required: requiredFields.some(matcher => key.includes(matcher)),
    password: passwordFields.some(matcher => key.includes(matcher)),
    encrypted: encryptedFields.some(matcher => key.includes(matcher)),
    lowercase: lowercaseFields.some(matcher => key.includes(matcher))
  };
}
