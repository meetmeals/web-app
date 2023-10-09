import { Device } from 'stores/platform';

export type Point<T> = {
    latitude: T;
    longitude: T;
};

export enum DistanceUnit {
    KM = 6371,
    MILE = 3956,
}

function convertDegreesToRadius(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function calculateDistance(
    point1: Point<number>,
    point2: Point<number>,
    distanceUnit = DistanceUnit.KM,
) {
    const point1InRadius: Point<number> = {
        latitude: convertDegreesToRadius(point1.latitude),
        longitude: convertDegreesToRadius(point1.longitude),
    };
    const point2InRadius: Point<number> = {
        latitude: convertDegreesToRadius(point2.latitude),
        longitude: convertDegreesToRadius(point2.longitude),
    };

    const longitudeDelta = point2InRadius.longitude - point1InRadius.longitude;
    const latitudeDelta = point2InRadius.latitude - point1InRadius.latitude;

    const a =
        Math.pow(Math.sin(latitudeDelta / 2), 2) +
        Math.cos(point1InRadius.latitude) *
            Math.cos(point2InRadius.latitude) *
            Math.pow(Math.sin(longitudeDelta / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));

    return c * distanceUnit;
}

export enum Map {
    GoogleMaps,
    Waze,
}

export function getMapsLink(
    device: Device,
    point: Point<string>,
    map: Map,
): string {
    if (map == Map.GoogleMaps) {
        switch (device) {
            case Device.Android:
                return `geo:${point.latitude},${point.longitude}`;
            case Device.iOS:
                return `comgooglemaps://?q=${point.latitude},${point.longitude}`;
            default:
                return `https://maps.google.com/?q=${point.latitude},${point.longitude}`;
        }
    } else if (map === Map.Waze) {
        return `https://waze.com/live-map/directions?to=ll.${point.latitude},${point.longitude}`;
    }
    // [TODO]: Add other map providers
    return '';
}
