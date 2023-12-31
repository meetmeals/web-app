import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as EnSVG } from 'assets/flags/en.svg';
import { ReactComponent as NlSVG } from 'assets/flags/nl.svg';
import { ThemeEnum } from 'models/common';
import { RootState } from 'stores';
import { setLanguage } from 'stores/platform';
import {
    SUPPORTED_LANGUAGES,
    SUPPORTED_LANGUAGES_FULL_NAMES,
} from 'utilities/constants';
import { useClickOutside } from 'utilities/hooks';

import styles from './language-picker.module.scss';

const LANGUAGE_FLAGS = [NlSVG, EnSVG];

type LanguagePickerProps = {
    theme: ThemeEnum;
};

function LanguagePicker(props: LanguagePickerProps) {
    const { isMobile } = useSelector((state: RootState) => state.platform);
    const [isOpen, setOpen] = React.useState<boolean>(false);
    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    const wrapperRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(wrapperRef, () => setOpen(false));

    const languages = SUPPORTED_LANGUAGES.map((lang, idx) => ({
        lang,
        Component: LANGUAGE_FLAGS[idx],
        langFullName: SUPPORTED_LANGUAGES_FULL_NAMES[idx],
    }));

    return (
        <div
            className={classNames(styles.dropdown, {
                [styles['dropdown--green']]: props.theme === ThemeEnum.GREEN,
            })}
            ref={wrapperRef}
        >
            <div
                className={styles['dropdown__button-container']}
                onClick={() => setOpen((prev) => !prev)}
            >
                <FaGlobe size="1.6rem" />
                <div>
                    {
                        languages.find((lang) => i18n.language === lang.lang)
                            ?.langFullName
                    }
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
                                setOpen(false);
                            }}
                        >
                            <Component
                                width={isMobile ? '22px' : '30px'}
                                height={isMobile ? '22px' : '30px'}
                            />
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
