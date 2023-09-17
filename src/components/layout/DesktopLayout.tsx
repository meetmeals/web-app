import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AuthWrapper from 'components/auth-wrapper';
import { AuthStep } from 'models/common';
import { RootState } from 'stores';
import { setAuthenticating } from 'stores/user';

import styles from './desktop-layout.module.scss';

type DesktopLayoutProps = {
    children: ReactNode;
};

function DesktopLayout(props: DesktopLayoutProps) {
    const { authenticationStep } = useSelector(
        (state: RootState) => state.user,
    );

    const dispatch = useDispatch();

    return (
        <div className={styles.container}>
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

export default DesktopLayout;
