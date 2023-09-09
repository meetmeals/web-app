import { useTranslation } from 'react-i18next';

import { APP_NAME, APP_VERSION } from 'utilities/constants';

import styles from './app-rights-version.module.scss';

function AppRightsVersion() {
    const { t } = useTranslation();

    return (
        <section className={styles.container}>
            <p className={styles['container__rights']}>
                &copy; {APP_NAME} {new Date().getUTCFullYear()},{' '}
                {t('app.rights')}.
            </p>
            <p className={styles['container__version']}>v{APP_VERSION}</p>
        </section>
    );
}

export default AppRightsVersion;
