import { useTranslation } from 'react-i18next';

import LoadingSpinner from 'components/loading-spinner';

import styles from './loading-overlay.module.scss';

function LoadingOverlay() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles['container__loading']}>
                <span>{t('app.loading')}...</span>
                <LoadingSpinner />
            </div>
        </div>
    );
}

export default LoadingOverlay;
