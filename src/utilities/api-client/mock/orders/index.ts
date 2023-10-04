import {
    OrdersApiClientInterface,
    OrdersApiClientModel,
    OrdersApiClientOptions,
} from 'utilities/api-client/models/orders';

const ordersBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/mock-data/orders`;

const options: OrdersApiClientOptions = {
    endpoints: {
        orderSubmit: ordersBaseUrl + '/order-submit',
    },
};

export const ordersApiClient: OrdersApiClientInterface =
    new OrdersApiClientModel(options);
