import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';
import { ConstantTextResponseInterface } from 'models/constant-text';

import { ConstantTextApiClientInterface } from './ConstantTextApiClient.interface';
import {
    ConstantTextApiClientEndpoints,
    ConstantTextApiClientOptions,
} from './ConstantTextApiClientOptions.interface';

/**
 * @name ConstantTextApiClientModel
 * @description Implements the ConstantTextApiClientInterface
 */
export class ConstantTextApiClientModel
    implements ConstantTextApiClientInterface
{
    private readonly endpoints!: ConstantTextApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: ConstantTextApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    default(headers: object): Promise<ConstantTextResponseInterface> {
        return new Promise<ConstantTextResponseInterface>((resolve) => {
            const endpoint = this.endpoints.default;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.GET,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: ConstantTextResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `ConstantTextApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
}
