import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LanguagePicker from 'components/language-picker';
import { ThemeEnum } from 'models/common';
import { pages } from 'utilities/constants';
import { useCurrentPage } from 'utilities/hooks';

import styles from './desktop-header.module.scss';

function DesktopHeader() {
    const currentPage = useCurrentPage();
    const { t } = useTranslation();

    return (
        <header className={styles.header}>
            <nav className={styles['header__nav']}>
                <Link to={pages.explore.path}>
                    <img
                        alt="Meetmeals logo"
                        className={styles['header__nav__logo']}
                        src="img/meetmeals-logo.png"
                    />
                </Link>
                <section className={styles['header__nav__links']}>
                    <Link
                        to={pages.explore.alias!}
                        className={classNames(styles['header__nav__links__a'], {
                            [styles['header__nav__links__a--active']]:
                                currentPage === pages.explore.transKey,
                        })}
                    >
                        <span>{t(pages.explore.transKey)}</span>
                    </Link>
                    <Link
                        to={pages.packages.path}
                        className={classNames(styles['header__nav__links__a'], {
                            [styles['header__nav__links__a--active']]:
                                currentPage === pages.packages.transKey,
                        })}
                    >
                        <span>{t(pages.packages.transKey)}</span>
                    </Link>
                    <Link
                        to={pages.contactUs.path}
                        className={classNames(styles['header__nav__links__a'], {
                            [styles['header__nav__links__a--active']]:
                                currentPage === pages.contactUs.transKey,
                        })}
                    >
                        <span>{t(pages.contactUs.transKey)}</span>
                    </Link>
                </section>
            </nav>
            <section className={styles['header__more']}>
                <LanguagePicker theme={ThemeEnum.WHITE} />
                <button className={styles['header__more__login-btn']}>
                    {t('login.submit')}
                </button>
            </section>
        </header>
    );
}

export default DesktopHeader;
