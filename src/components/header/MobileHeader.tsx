import classNames from 'classnames';
import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { pages } from 'utilities/constants';

import styles from './mobile-header.module.scss';

function MobileHeader() {
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
        <section className={styles['header__nav__links']}>
          <Link
            to={pages.explore.alias}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.explore.transKey,
            })}
            onClick={() => handleLinkClick(pages.explore.transKey)}
          >
            <div className={styles['header__nav__links__container']}>
              <FaGlobe />
              <span>{t(pages.explore.transKey)}</span>
            </div>
          </Link>
          <Link
            to={pages.list.path}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.list.transKey,
            })}
            onClick={() => handleLinkClick(pages.list.transKey)}
          >
            <div className={styles['header__nav__links__container']}>
              <FaGlobe />
              <span>{t(pages.list.transKey)}</span>
            </div>
          </Link>
          <Link
            to={pages.contactUs.path}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.contactUs.transKey,
            })}
            onClick={() => handleLinkClick(pages.contactUs.transKey)}
          >
            <div className={styles['header__nav__links__container']}>
              <FaGlobe />
              <span>{t(pages.contactUs.transKey)}</span>
            </div>
          </Link>
          <Link
            to={pages.profile.path}
            className={classNames(styles['header__nav__links__a'], {
              [styles['header__nav__links__a--active']]:
                activeLink === pages.profile.transKey,
            })}
            onClick={() => handleLinkClick(pages.profile.transKey)}
          >
            <div className={styles['header__nav__links__container']}>
              <FaGlobe />
              <span>{t(pages.profile.transKey)}</span>
            </div>
          </Link>
        </section>
      </nav>
    </header>
  );
}

export default MobileHeader;
