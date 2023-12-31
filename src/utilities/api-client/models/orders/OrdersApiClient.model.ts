import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';
import {
    OrdersResponseInterface,
    OrderSubmitRequestInterface,
    OrderSubmitResponseInterface,
    OrderDetailsRequestInterface,
    OrderDetailsResponseInterface,
    OrderReceivedResponseInterface,
} from 'models/orders';

import { OrdersApiClientInterface } from './OrdersApiClient.interface';
import {
    OrdersApiClientEndpoints,
    OrdersApiClientOptions,
} from './OrdersApiClientOptions.interface';

/**
 * @name OrdersApiClientModel
 * @description Implements the OrdersApiClientInterface
 */
export class OrdersApiClientModel implements OrdersApiClientInterface {
    private readonly endpoints!: OrdersApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: OrdersApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    orderSubmit(
        body: OrderSubmitRequestInterface,
        headers: object,
    ): Promise<OrderSubmitResponseInterface> {
        return new Promise<OrderSubmitResponseInterface>((resolve) => {
            const endpoint = this.endpoints.orderSubmit;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: OrderSubmitResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `OrdersApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    orderNewList(
        headers: object,
        page: number,
    ): Promise<OrdersResponseInterface> {
        return new Promise<OrdersResponseInterface>((resolve) => {
            const endpoint = this.endpoints.orderNewList + `?page=${page}`;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.GET,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: OrdersResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `OrdersApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    orderOldList(
        headers: object,
        page: number,
    ): Promise<OrdersResponseInterface> {
        return new Promise<OrdersResponseInterface>((resolve) => {
            const endpoint = this.endpoints.orderOldList + `?page=${page}`;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.GET,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: OrdersResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `OrdersApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    orderDetail(
        body: OrderDetailsRequestInterface,
        headers: object,
    ): Promise<OrderDetailsResponseInterface> {
        return new Promise<OrderDetailsResponseInterface>((resolve) => {
            const endpoint = this.endpoints.orderDetail;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: OrderDetailsResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `OrdersApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    orderReceived(
        orderId: string,
        headers: object,
    ): Promise<OrderReceivedResponseInterface> {
        return new Promise<OrderReceivedResponseInterface>((resolve) => {
            const endpoint =
                this.endpoints.orderReceived + `?order_id=${orderId}`;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: Object.assign(headers, {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                }),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: OrderReceivedResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `OrdersApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
}
