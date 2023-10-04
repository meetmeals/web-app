import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';
import {
    OrderSubmitRequestInterface,
    OrderSubmitResponseInterface,
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
}
