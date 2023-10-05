import { UserProfileResponseInterface } from 'models/account';
import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';

import { AccountApiClientInterface } from './AccountApiClient.interface';
import {
    AccountApiClientEndpoints,
    AccountApiClientOptions,
} from './AccountApiClientOptions.interface';

/**
 * @name AccountApiClientModel
 * @description Implements the AccountApiClientInterface
 */
export class AccountApiClientModel implements AccountApiClientInterface {
    private readonly endpoints!: AccountApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: AccountApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    profile(headers: object): Promise<UserProfileResponseInterface> {
        return new Promise<UserProfileResponseInterface>((resolve) => {
            const endpoint = this.endpoints.profile;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.GET,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: UserProfileResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `AccountApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    orders(body: object): Promise<object> {
        return new Promise((resolve) => resolve(body));
    }
    favorites(body: object): Promise<object> {
        return new Promise((resolve) => resolve(body));
    }
    comments(body: object): Promise<object> {
        return new Promise((resolve) => resolve(body));
    }
}
