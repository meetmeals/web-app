import i18next from 'i18next';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import {
  AppVersion,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from 'utilities/constants';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    lng: DEFAULT_LANGUAGE,
    backend: {
      queryStringParams: { v: AppVersion },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    load: 'languageOnly',
    supportedLngs: SUPPORTED_LANGUAGES,
  });

export default i18next;
