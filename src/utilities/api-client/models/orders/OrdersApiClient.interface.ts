import { OrderSubmitResponseInterface } from 'models/orders';
import { OrderSubmitRequestInterface } from 'models/orders';

/**
 * @name OrdersApiClientInterface
 * @description Interface for the Orders API client module
 */
export interface OrdersApiClientInterface {
    orderSubmit: (
        body: OrderSubmitRequestInterface,
        headers: object,
    ) => Promise<OrderSubmitResponseInterface>;
}
