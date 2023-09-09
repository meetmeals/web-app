import { useSelector } from 'react-redux';

import { RootState } from 'stores';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

function Header() {
    const { isMobile } = useSelector((state: RootState) => state.platform);

    return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

export default Header;
