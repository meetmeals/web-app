import { useSelector } from 'react-redux';
import { RootState } from 'stores';

import DesktopContactUs from './DesktopContactUs';
import MobileContactUs from './MobileContactUs';

function ContactUs() {
    const { isMobile } = useSelector((state: RootState) => state.platform);

    return isMobile ? <MobileContactUs /> : <DesktopContactUs />;
}

export default ContactUs;
