import {
    FavoritesRequestInterface,
    FavoritesResponseInterface,
    FilterRequestInterface,
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
    filter: (
        body: FilterRequestInterface,
        headers: object,
    ) => Promise<FilterResponseInterface>;
    surfing: (
        body: SurfingRequestInterface,
        headers: object,
    ) => Promise<SurfingResponseInterface>;
    packageLike: (
        body: PackageLikeRequestInterface,
        headers: object,
    ) => Promise<PackageLikeResponseInterface>;
    favorites: (
        body: FavoritesRequestInterface,
        headers: object,
    ) => Promise<FavoritesResponseInterface>;
}
