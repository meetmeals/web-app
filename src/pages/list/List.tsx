import { useSelector } from 'react-redux';
import { RootState } from 'stores';

import DesktopList from './DesktopList';
import MobileList from './MobileList';

function ContactUs() {
    const { isMobile } = useSelector((state: RootState) => state.platform);

    return isMobile ? <MobileList /> : <DesktopList />;
}

export default ContactUs;
