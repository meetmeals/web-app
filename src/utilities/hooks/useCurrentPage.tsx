import React from 'react';
import { useLocation } from 'react-router-dom';

import { pages } from 'utilities/constants';

function useCurrentPage() {
    const location = useLocation();
    const [currentPage, setCurrentPage] = React.useState<string>('');

    React.useEffect(() => {
        const path = location.pathname;

        if (path.includes(pages.explore.alias!))
            setCurrentPage(pages.explore.transKey);
        if (path.includes(pages.packages.path))
            setCurrentPage(pages.packages.transKey);
        if (path.includes(pages.contactUs.path))
            setCurrentPage(pages.contactUs.transKey);
        if (path.includes(pages.account.path))
            setCurrentPage(pages.account.transKey);
    }, [location]);

    return currentPage;
}

export default useCurrentPage;
