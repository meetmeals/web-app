import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    FaGrinHearts,
    FaListAlt,
    FaRegCommentDots,
    FaUserCircle,
} from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import Comments from 'components/comments/Comments';
import Favorites from 'components/favorites/Favorites';
import Orders from 'components/orders/Orders';
import Profile from 'components/profile/Profile';

import styles from './account.module.scss';

enum AccountTabs {
    Profile = 'profile',
    Orders = 'orders',
    Favorites = 'favorites',
    Comments = 'comments',
}

const tabs = [
    { tab: AccountTabs.Profile, icon: <FaUserCircle size="25px" /> },
    { tab: AccountTabs.Orders, icon: <FaListAlt size="25px" /> },
    { tab: AccountTabs.Favorites, icon: <FaGrinHearts size="25px" /> },
    { tab: AccountTabs.Comments, icon: <FaRegCommentDots size="25px" /> },
];

function Account() {
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

        const idx = tabs.map((tab) => tab.tab).indexOf(tab as AccountTabs);
        if (idx > 0) setActiveTab(tabs[idx].tab);
    }, [searchParams, setSearchParams]);

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

    return (
        <div className={styles.container}>
            <h2 className={styles['container__header']}>
                {t('app.account')} / {t(`app.${activeTab.toString()}`)}
            </h2>
            <div className={styles['container__body']}>{view}</div>
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
        </div>
    );
}

export default Account;
