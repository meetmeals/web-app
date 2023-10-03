import React from 'react';

import { Point } from 'utilities/geometry';

enum GeolocationError {
    NOT_SUPPORTED = 10,
}

function useLocation() {
    const [location, setLocation] = React.useState<Point>({
        latitude: 0,
        longitude: 0,
    });
    const [error, setError] = React.useState<number>(0);

    function onChange({ coords }: { coords: Point }) {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    }

    function onError(error: GeolocationPositionError) {
        console.warn(`${error.code}: ${error.message}.`);
    }

    React.useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                function (error) {
                    setError(error.code);
                },
            );
            const watcher = navigator.geolocation.watchPosition(
                onChange,
                onError,
            );
            return () => navigator.geolocation.clearWatch(watcher);
        } else {
            setError(GeolocationError.NOT_SUPPORTED);
        }
    }, []);

    return { location, error };
}

export default useLocation;
