/**
 * @name OrdersApiClientEndpoints
 * @description Interface to wrap all package-related URLs
 */
export interface OrdersApiClientEndpoints {
    orderSubmit: string;
}

/**
 * @name OrdersApiClientOptions
 * @description Interface to wrap Orders API client options
 */
export interface OrdersApiClientOptions {
    mockDelay?: number;
    endpoints: OrdersApiClientEndpoints;
}