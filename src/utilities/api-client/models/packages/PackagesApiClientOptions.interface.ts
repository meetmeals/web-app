/**
 * @name PackagesApiClientEndpoints
 * @description Interface to wrap all package-related URLs
 */
export interface PackagesApiClientEndpoints {
    filter: string;
    surfing: string;
    packageLike: string;
    favorites: string;
    packageInfo: string;
}

/**
 * @name PackagesApiClientOptions
 * @description Interface to wrap Packages API client options
 */
export interface PackagesApiClientOptions {
    mockDelay?: number;
    endpoints: PackagesApiClientEndpoints;
}
