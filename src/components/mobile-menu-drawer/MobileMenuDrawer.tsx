import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import AppRightsVersion from 'components/app-rights-version';
import LanguagePicker from 'components/language-picker';
import { AuthStep, ThemeEnum } from 'models/common';
import { RootState } from 'stores';
import { setMobileDrawerOpen } from 'stores/platform';
import { setAuthenticating, setLoggedIn } from 'stores/user';
import { pages } from 'utilities/constants';
import { useCurrentPage } from 'utilities/hooks';

import styles from './mobile-menu-drawer.module.scss';

type MobileMenuDrawerProps = {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

function MobileMenuDrawer(props: MobileMenuDrawerProps) {
    const { isLoggedIn } = useSelector((state: RootState) => state.user);
    const currentPage = useCurrentPage();

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    function handleMenuClose() {
        props.setOpen(false);
        dispatch(setMobileDrawerOpen({ isMobileDrawerOpen: false }));
    }

    return (
        <div
            className={classNames(styles.container, {
                [styles['container--open']]: props.isOpen,
            })}
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
                        src="/img/meetmeals-logo-green.png"
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
                            onClick={() => handleMenuClose()}
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
                            onClick={() => handleMenuClose()}
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
                            onClick={() => handleMenuClose()}
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
                    <div
                        className={styles['container__content__more__account']}
                    >
                        {isLoggedIn && (
                            <p
                                className={
                                    styles[
                                        'container__content__more__account__account-btn'
                                    ]
                                }
                                onClick={() => {
                                    handleMenuClose();
                                    navigate({
                                        pathname: pages.account.path,
                                        search: '?tab=profile',
                                    });
                                }}
                            >
                                {t('app.account')}
                            </p>
                        )}
                        <p
                            className={classNames(
                                styles[
                                    'container__content__more__account__login'
                                ],
                                {
                                    [styles[
                                        'container__content__more__account__login--logout'
                                    ]]: isLoggedIn,
                                },
                            )}
                            onClick={() => {
                                handleMenuClose();
                                if (isLoggedIn)
                                    dispatch(
                                        setLoggedIn({ isLoggedIn: false }),
                                    );
                                else
                                    dispatch(
                                        setAuthenticating({
                                            authStep: AuthStep.LOGIN,
                                        }),
                                    );
                            }}
                        >
                            {isLoggedIn ? t('app.logout') : t('login.submit')}
                        </p>
                    </div>
                </section>
            </div>
            <AppRightsVersion />
        </div>
    );
}

export default MobileMenuDrawer;
