import classNames from 'classnames';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'stores';

import styles from './mobile-layout.module.scss';

type MobileLayoutProps = {
    children: ReactNode;
};

function MobileLayout(props: MobileLayoutProps) {
    const { isMobileDrawerOpen } = useSelector(
        (state: RootState) => state.platform,
    );
    return (
        <div
            className={classNames(styles.container, {
                [styles['container--mobile-drawer-open']]: isMobileDrawerOpen,
            })}
        >
            {props.children}
        </div>
    );
}

export default MobileLayout;
