import {
    OrdersResponseInterface,
    OrderSubmitResponseInterface,
    OrderSubmitRequestInterface,
    OrderDetailsRequestInterface,
    OrderDetailsResponseInterface,
} from 'models/orders';

/**
 * @name OrdersApiClientInterface
 * @description Interface for the Orders API client module
 */
export interface OrdersApiClientInterface {
    orderSubmit: (
        body: OrderSubmitRequestInterface,
        headers: object,
    ) => Promise<OrderSubmitResponseInterface>;
    orderNewList: (
        headers: object,
        page: number,
    ) => Promise<OrdersResponseInterface>;
    orderOldList: (
        headers: object,
        page: number,
    ) => Promise<OrdersResponseInterface>;
    orderDetail: (
        body: OrderDetailsRequestInterface,
        headers: object,
    ) => Promise<OrderDetailsResponseInterface>;
}
