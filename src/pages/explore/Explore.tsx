import React from 'react';

import NationalityPicker from 'components/nationality-picker';
import { ThemeColor } from 'utilities/constants';
import { useLocation } from 'utilities/hooks';

function Explore() {
    const { location, error } = useLocation();

    React.useEffect(() => {
        if (error || location.latitude === 0 || location.longitude === 0) {
            console.warn('No location access');
        } else {
            // Call surfing API with location
        }
    }, [error, location]);

    return (
        <>
            <NationalityPicker theme={ThemeColor.BLACK} />
        </>
    );
}

export default Explore;
