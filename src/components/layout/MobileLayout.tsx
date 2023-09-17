import classNames from 'classnames';
import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AuthWrapper from 'components/auth-wrapper';
import { AuthStep } from 'models/common';
import { RootState } from 'stores';
import { setAuthenticating } from 'stores/user';

import styles from './mobile-layout.module.scss';

type MobileLayoutProps = {
    children: ReactNode;
};

function MobileLayout(props: MobileLayoutProps) {
    const { isMobileDrawerOpen } = useSelector(
        (state: RootState) => state.platform,
    );
    const { authenticationStep } = useSelector(
        (state: RootState) => state.user,
    );

    const dispatch = useDispatch();

    return (
        <div
            className={classNames(styles.container, {
                [styles['container--mobile-drawer-open']]: isMobileDrawerOpen,
            })}
        >
            {authenticationStep !== AuthStep.NONE && (
                <AuthWrapper
                    step={authenticationStep}
                    onClose={() => {
                        dispatch(
                            setAuthenticating({ authStep: AuthStep.NONE }),
                        );
                    }}
                />
            )}
            {props.children}
        </div>
    );
}

export default MobileLayout;
