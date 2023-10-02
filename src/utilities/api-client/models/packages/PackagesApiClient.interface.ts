import {
    FilterResponseInterface,
    PackageLikeRequestInterface,
    PackageLikeResponseInterface,
    SurfingRequestInterface,
    SurfingResponseInterface,
} from 'models/packages';

/**
 * @name PackagesApiClientInterface
 * @description Interface for the Packages API client module
 */
export interface PackagesApiClientInterface {
    filter: (headers: object) => Promise<FilterResponseInterface>;
    surfing: (
        body: SurfingRequestInterface,
    ) => Promise<SurfingResponseInterface>;
    packageLike: (
        body: PackageLikeRequestInterface,
        headers: object,
    ) => Promise<PackageLikeResponseInterface>;
}
