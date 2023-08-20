import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LanguagePicker from 'components/language-picker/LanguagePicker';
import { pages } from 'utilities/constants';
import styles from './desktop-header.module.scss';

function DesktopHeader() {
  const [activeLink, setActiveLink] = React.useState<string>(
    pages.explore.transKey,
  );

  const { t } = useTranslation();

  function handleLinkClick(linkKey: string) {
    setActiveLink(linkKey);
  }

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
            to={pages.explore.alias}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.explore.transKey,
            })}
            onClick={() => handleLinkClick(pages.explore.transKey)}
          >
            <span>{t(pages.explore.transKey)}</span>
          </Link>
          <Link
            to={pages.list.path}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.list.transKey,
            })}
            onClick={() => handleLinkClick(pages.list.transKey)}
          >
            <span>{t(pages.list.transKey)}</span>
          </Link>
          <Link
            to={pages.contactUs.path}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.contactUs.transKey,
            })}
            onClick={() => handleLinkClick(pages.contactUs.transKey)}
          >
            <span>{t(pages.contactUs.transKey)}</span>
          </Link>
        </section>
      </nav>
      <section className={styles['header__more']}>
        <LanguagePicker />
      </section>
    </header>
  );
}

export default DesktopHeader;
