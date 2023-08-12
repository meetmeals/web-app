import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ReactComponent as EnSVG } from 'assets/flags/en.svg';
import { ReactComponent as NlSVG } from 'assets/flags/nl.svg';
import { setLanguage } from 'stores/platform';
import { useClickOutside } from 'utilities/hooks';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_FULL_NAMES,
} from 'utilities/constants';

import styles from './language-picker.module.scss';

const LANGUAGE_FLAGS = [NlSVG, EnSVG];

function LanguagePicker() {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => setOpen(false));

  React.useEffect(() => {
    const languageSearchParam = searchParams.get('lang');
    if (
      languageSearchParam &&
      SUPPORTED_LANGUAGES.includes(languageSearchParam)
    ) {
      dispatch(setLanguage({ language: languageSearchParam }));
      i18n.changeLanguage(languageSearchParam);
    }
  }, [dispatch, i18n, searchParams]);

  const languages = SUPPORTED_LANGUAGES.map((lang, idx) => ({
    lang,
    Component: LANGUAGE_FLAGS[idx],
    langFullName: SUPPORTED_LANGUAGES_FULL_NAMES[idx],
  }));

  return (
    <div className={styles.dropdown} ref={wrapperRef}>
      <div
        className={styles['dropdown__button-container']}
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaGlobe size="1.6rem" />
        <div>
          {languages.find((lang) => i18n.language === lang.lang)?.langFullName}
        </div>
      </div>
      <div
        className={classNames(styles['dropdown__content'], {
          [styles['dropdown__content--visible']]: isOpen,
        })}
      >
        {languages
          .filter((lang) => i18n.language !== lang.lang)
          .map(({ lang, Component }) => (
            <span
              key={lang}
              className={styles['dropdown__content__a']}
              onClick={() => {
                dispatch(setLanguage({ language: lang }));
                i18n.changeLanguage(lang);
                const currentSearchParams: { [key: string]: string } = {};
                searchParams.forEach(
                  (value, key) => (currentSearchParams[key] = value),
                );
                setSearchParams({ ...currentSearchParams, lang });
                setOpen(false);
              }}
            >
              <Component width="30px" height="30px" />
              <span className={styles['dropdown__content__span']}>
                {lang.toUpperCase()}
              </span>
            </span>
          ))}
      </div>
    </div>
  );
}

export default LanguagePicker;
