export type Point = {
    latitude: number;
    longitude: number;
};

export enum DistanceUnit {
    KM = 6371,
    MILE = 3956,
}

function convertDegreesToRadius(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function calculateDistance(
    point1: Point,
    point2: Point,
    distanceUnit = DistanceUnit.KM,
) {
    const point1InRadius: Point = {
        latitude: convertDegreesToRadius(point1.latitude),
        longitude: convertDegreesToRadius(point1.longitude),
    };
    const point2InRadius: Point = {
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
