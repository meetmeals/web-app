import React from 'react';

type LocationType = {
    latitude: number;
    longitude: number;
};

enum GeolocationError {
    NOT_SUPPORTED = 10,
}

function useLocation() {
    const [location, setLocation] = React.useState<LocationType>({
        latitude: 0,
        longitude: 0,
    });
    const [error, setError] = React.useState<number>(0);

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
        } else {
            setError(GeolocationError.NOT_SUPPORTED);
        }
    }, []);

    return { location, error };
}

export default useLocation;
