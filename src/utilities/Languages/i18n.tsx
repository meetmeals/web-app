import i18next from 'i18next';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { PlatformEnum } from 'models/local-storage';
import {
    APP_VERSION,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
} from 'utilities/constants';

const platformLanguage =
    localStorage.getItem(PlatformEnum.LANGUAGE) || DEFAULT_LANGUAGE;

i18next
    .use(Backend)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
        lng: platformLanguage,
        backend: {
            queryStringParams: { v: APP_VERSION },
        },
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
            escapeValue: false,
        },
        load: 'languageOnly',
        supportedLngs: SUPPORTED_LANGUAGES,
    });

export default i18next;
