import AppRightsVersion from 'components/app-rights-version/AppRightsVersion';

import styles from './footer.module.scss';

function Footer() {
    return (
        <div className={styles.container}>
            <AppRightsVersion />
        </div>
    );
}

export default Footer;
