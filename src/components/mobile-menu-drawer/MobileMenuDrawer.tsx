import classNames from 'classnames';
import { Dispatch, SetStateAction, useRef, useState, TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import AppRightsVersion from 'components/app-rights-version';
import LanguagePicker from 'components/language-picker';
import { ThemeEnum } from 'models/common';
import { setMobileDrawerOpen } from 'stores/platform';
import { pages } from 'utilities/constants';
import { useClickOutside, useCurrentPage } from 'utilities/hooks';

import styles from './mobile-menu-drawer.module.scss';

type MobileMenuDrawerProps = {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

const MIN_SWIPE_DISTANCE = 30;

function MobileMenuDrawer(props: MobileMenuDrawerProps) {
    const currentPage = useCurrentPage();
    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);

    const wrapperRef = useRef<HTMLDivElement>(null);
    useClickOutside(wrapperRef, () => props.setOpen(false));

    const dispatch = useDispatch();
    const { t } = useTranslation();

    function onTouchStart(e: TouchEvent<HTMLDivElement>) {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    }
    function onTouchMove(e: TouchEvent<HTMLDivElement>) {
        setTouchEnd(e.targetTouches[0].clientX);
    }
    function onTouchEnd() {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isSwipeToRight = distance < -MIN_SWIPE_DISTANCE;
        if (isSwipeToRight) props.setOpen(false);
        dispatch(setMobileDrawerOpen({ isMobileDrawerOpen: false }));
    }

    function handleNavItemClick() {
        props.setOpen(false);
        dispatch(setMobileDrawerOpen({ isMobileDrawerOpen: false }));
    }

    return (
        <div
            className={classNames(styles.container, {
                [styles['container--open']]: props.isOpen,
            })}
            ref={wrapperRef}
            onTouchMove={onTouchMove}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <img
                alt="Close menu"
                className={styles['container__close-btn']}
                src="/img/icons/common/close-menu.svg"
                onClick={() => {
                    props.setOpen(false);
                    dispatch(
                        setMobileDrawerOpen({ isMobileDrawerOpen: false }),
                    );
                }}
            />
            <div className={styles['container__content']}>
                <section className={styles['container__content__logo']}>
                    <img
                        alt="Meetmeals logo"
                        className={styles['container__content__logo__img']}
                        src="img/meetmeals-logo-green.png"
                    />
                </section>
                <section className={styles['container__content__nav']}>
                    <p
                        className={classNames(
                            styles['container__content__nav__item'],
                            {
                                [styles[
                                    'container__content__nav__item--active'
                                ]]: currentPage === pages.explore.transKey,
                            },
                        )}
                    >
                        <Link
                            to={pages.explore.alias!}
                            className={
                                styles['container__content__nav__item__a']
                            }
                            onClick={() => handleNavItemClick()}
                        >
                            <span
                                className={
                                    styles[
                                        'container__content__nav__item__a__title'
                                    ]
                                }
                            >
                                {t(pages.explore.transKey)}
                            </span>
                            <span
                                className={
                                    styles[
                                        'container__content__nav__item__a__description'
                                    ]
                                }
                            >
                                {t(pages.explore.descriptionTransKey)}
                            </span>
                        </Link>
                    </p>
                    <p
                        className={classNames(
                            styles['container__content__nav__item'],
                            {
                                [styles[
                                    'container__content__nav__item--active'
                                ]]: currentPage === pages.packages.transKey,
                            },
                        )}
                    >
                        <Link
                            to={pages.packages.path}
                            className={
                                styles['container__content__nav__item__a']
                            }
                            onClick={() => handleNavItemClick()}
                        >
                            <span
                                className={
                                    styles[
                                        'container__content__nav__item__a__title'
                                    ]
                                }
                            >
                                {t(pages.packages.transKey)}
                            </span>
                            <span
                                className={
                                    styles[
                                        'container__content__nav__item__a__description'
                                    ]
                                }
                            >
                                {t(pages.packages.descriptionTransKey)}
                            </span>
                        </Link>
                    </p>
                    <p
                        className={classNames(
                            styles['container__content__nav__item'],
                            styles['container__content__nav__item--last'],
                            {
                                [styles[
                                    'container__content__nav__item--active'
                                ]]: currentPage === pages.contactUs.transKey,
                            },
                        )}
                    >
                        <Link
                            to={pages.contactUs.path}
                            className={
                                styles['container__content__nav__item__a']
                            }
                            onClick={() => handleNavItemClick()}
                        >
                            <span
                                className={
                                    styles[
                                        'container__content__nav__item__a__title'
                                    ]
                                }
                            >
                                {t(pages.contactUs.transKey)}
                            </span>
                            <span
                                className={
                                    styles[
                                        'container__content__nav__item__a__description'
                                    ]
                                }
                            >
                                {t(pages.contactUs.descriptionTransKey)}
                            </span>
                        </Link>
                    </p>
                </section>
                <section className={styles['container__content__more']}>
                    <LanguagePicker theme={ThemeEnum.GREEN} />
                    <p className={styles['container__content__more__login']}>
                        {t('login.submit')}
                    </p>
                </section>
            </div>
            <AppRightsVersion />
        </div>
    );
}

export default MobileMenuDrawer;
