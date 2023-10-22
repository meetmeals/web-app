import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'stores';

import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

type LayoutProps = {
    children: ReactNode;
};

function Layout(props: LayoutProps) {
    const { isMobile } = useSelector((state: RootState) => state.platform);

    return isMobile ? (
        <MobileLayout>{props.children}</MobileLayout>
    ) : (
        <DesktopLayout>{props.children}</DesktopLayout>
    );
}

export default Layout;
