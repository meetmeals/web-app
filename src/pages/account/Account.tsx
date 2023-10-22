import classNames from 'classnames';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    FaGrinHearts,
    FaListAlt,
    FaRegCommentDots,
    FaUserCircle,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Comments from 'components/comments';
import Favorites from 'components/favorites';
import Orders from 'components/orders';
import Profile from 'components/profile';
import { RootState } from 'stores';

import styles from './account.module.scss';

enum AccountTabs {
    Profile = 'profile',
    Orders = 'orders',
    Favorites = 'favorites',
    Comments = 'comments',
}

const getTabs = (t: TFunction) => [
    {
        tab: AccountTabs.Profile,
        icon: <FaUserCircle size="25px" />,
        title: t('app.profile'),
    },
    {
        tab: AccountTabs.Orders,
        icon: <FaListAlt size="25px" />,
        title: t('app.orders'),
    },
    {
        tab: AccountTabs.Favorites,
        icon: <FaGrinHearts size="25px" />,
        title: t('app.favorites'),
    },
    {
        tab: AccountTabs.Comments,
        icon: <FaRegCommentDots size="25px" />,
        title: t('app.comments'),
    },
];

function Account() {
    const { isMobile } = useSelector((state: RootState) => state.platform);
    const [activeTab, setActiveTab] = React.useState<AccountTabs>(
        AccountTabs.Profile,
    );
    const [searchParams, setSearchParams] = useSearchParams();

    const { t } = useTranslation();

    React.useEffect(() => {
        const tab = searchParams.get('tab');
        if (!tab) {
            setSearchParams({ tab: AccountTabs.Profile.toString() });
            return;
        }

        const tabs = getTabs(t);
        const idx = tabs.map((tab) => tab.tab).indexOf(tab as AccountTabs);
        if (idx >= 0) setActiveTab(tabs[idx].tab);
    }, [searchParams, setSearchParams, t]);

    function handleTabChange(tab: AccountTabs) {
        setActiveTab(tab);
        setSearchParams({ tab: tab.toString() });
    }

    let view = null;
    switch (activeTab) {
        case AccountTabs.Profile:
            view = <Profile />;
            break;
        case AccountTabs.Orders:
            view = <Orders />;
            break;
        case AccountTabs.Favorites:
            view = <Favorites />;
            break;
        case AccountTabs.Comments:
            view = <Comments />;
            break;
    }

    const tabs = getTabs(t);

    return (
        <div className={styles.container}>
            {isMobile && (
                <h2 className={styles['container__header']}>
                    {t('app.account')} / {t(`app.${activeTab.toString()}`)}
                </h2>
            )}
            {!isMobile && (
                <nav>
                    <ul className={styles['container__desktop-nav']}>
                        {tabs.map((tab) => (
                            <li
                                key={tab.tab}
                                className={classNames(
                                    styles['container__desktop-nav__tab'],
                                    {
                                        [styles[
                                            'container__desktop-nav__tab--active'
                                        ]]: tab.tab === activeTab,
                                    },
                                )}
                                onClick={() => handleTabChange(tab.tab)}
                            >
                                {tab.icon}
                                {tab.title}
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
            <div className={styles['container__body']}>{view}</div>
            {isMobile && (
                <div className={styles['container__bottom-navigation']}>
                    {tabs.map((tab) => (
                        <section
                            key={tab.tab}
                            className={classNames(
                                styles['container__bottom-navigation__tab'],
                                {
                                    [styles[
                                        'container__bottom-navigation__tab--active'
                                    ]]: tab.tab === activeTab,
                                },
                            )}
                            onClick={() => handleTabChange(tab.tab)}
                        >
                            {tab.icon}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Account;
