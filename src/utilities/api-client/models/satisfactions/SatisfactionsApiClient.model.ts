import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';
import {
    SatisfactionDescRequestInterface,
    SatisfactionDescResponseInterface,
    SatisfactionDetailRequestInterface,
    SatisfactionDetailResponseInterface,
    SatisfactionListResponseInterface,
    SatisfactionTotalRequestInterface,
    SatisfactionTotalResponseInterface,
} from 'models/satisfactions';

import { SatisfactionsApiClientInterface } from './SatisfactionsApiClient.interface';
import {
    SatisfactionsApiClientEndpoints,
    SatisfactionsApiClientOptions,
} from './SatisfactionsApiClientOptions.interface';

/**
 * @name SatisfactionsApiClientModel
 * @description Implements the SatisfactionsApiClientInterface
 */
export class SatisfactionsApiClientModel
    implements SatisfactionsApiClientInterface
{
    private readonly endpoints!: SatisfactionsApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: SatisfactionsApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    satisfactionDetail(
        body: SatisfactionDetailRequestInterface,
        headers: object,
    ): Promise<SatisfactionDetailResponseInterface> {
        return new Promise<SatisfactionDetailResponseInterface>((resolve) => {
            const endpoint = this.endpoints.satisfactionDetail;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: SatisfactionDetailResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `SatisfactionsApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    satisfactionTotal(
        body: SatisfactionTotalRequestInterface,
        headers: object,
    ): Promise<SatisfactionTotalResponseInterface> {
        return new Promise<SatisfactionTotalResponseInterface>((resolve) => {
            const endpoint = this.endpoints.satisfactionTotal;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: SatisfactionTotalResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `SatisfactionsApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    satisfactionDesc(
        body: SatisfactionDescRequestInterface,
        headers: object,
    ): Promise<SatisfactionDescResponseInterface> {
        return new Promise<SatisfactionDescResponseInterface>((resolve) => {
            const endpoint = this.endpoints.satisfactionDesc;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.GET,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: SatisfactionDescResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `SatisfactionsApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    satisfactionList(
        headers: object,
        page: number,
    ): Promise<SatisfactionListResponseInterface> {
        return new Promise<SatisfactionListResponseInterface>((resolve) => {
            const endpoint = this.endpoints.satisfactionList + `?page=${page}`;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: SatisfactionListResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `SatisfactionsApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
}
