import React from 'react';

export default function useIsMounted() {
    const isMounted = React.useRef<boolean>(false);

    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return React.useCallback(() => isMounted.current, []);
}
