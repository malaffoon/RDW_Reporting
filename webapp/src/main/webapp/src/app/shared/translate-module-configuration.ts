import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { RdwTranslateLoader } from './i18n/rdw-translate-loader';

export const translateModuleConfiguration: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useClass: RdwTranslateLoader
  }
};
