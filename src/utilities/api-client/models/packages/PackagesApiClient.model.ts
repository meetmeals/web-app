import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';
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
import { PackagesApiClientInterface } from './PackagesApiClient.interface';
import {
    PackagesApiClientEndpoints,
    PackagesApiClientOptions,
} from './PackagesApiClientOptions.interface';

/**
 * @name PackagesApiClientModel
 * @description Implements the PackagesApiClientInterface
 */
export class PackagesApiClientModel implements PackagesApiClientInterface {
    private readonly endpoints!: PackagesApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: PackagesApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    filter(
        body: FilterRequestInterface,
        headers: object,
    ): Promise<FilterResponseInterface> {
        return new Promise<FilterResponseInterface>((resolve) => {
            const endpoint = this.endpoints.filter;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: FilterResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `PackagesApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    surfing(
        body: SurfingRequestInterface,
        headers: object,
    ): Promise<SurfingResponseInterface> {
        return new Promise<SurfingResponseInterface>((resolve) => {
            const endpoint = this.endpoints.surfing;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: SurfingResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `PackagesApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    packageLike(
        body: PackageLikeRequestInterface,
        headers: object,
    ): Promise<PackageLikeResponseInterface> {
        return new Promise<PackageLikeResponseInterface>((resolve) => {
            const endpoint = this.endpoints.packageLike;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: PackageLikeResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `PackagesApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
    favorites(
        body: FavoritesRequestInterface,
        headers: object,
        page: number,
    ): Promise<FavoritesResponseInterface> {
        return new Promise<FavoritesResponseInterface>((resolve) => {
            const endpoint = this.endpoints.favorites + `?page=${page}`;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: FavoritesResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `PackagesApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
}
