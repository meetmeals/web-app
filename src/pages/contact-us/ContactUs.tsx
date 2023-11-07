import { useSelector } from 'react-redux';
import { RootState } from 'stores';

import DesktopContactUs from './DesktopContactUs';
import MobileContactUs from './MobileContactUs';

function ContactUs() {
    const { isMobile, language } = useSelector(
        (state: RootState) => state.platform,
    );

    return isMobile ? (
        <MobileContactUs language={language} />
    ) : (
        <DesktopContactUs language={language} />
    );
}

export default ContactUs;
