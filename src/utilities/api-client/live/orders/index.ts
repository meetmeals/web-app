import {
    OrdersApiClientInterface,
    OrdersApiClientModel,
    OrdersApiClientOptions,
} from 'utilities/api-client/models/orders';

const ordersBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: OrdersApiClientOptions = {
    endpoints: {
        orderSubmit: ordersBaseUrl + '/order-submit',
        orderNewList: ordersBaseUrl + '/order-buying-list',
        orderOldList: ordersBaseUrl + '/order-bought-list',
        orderDetail: ordersBaseUrl + '/order-detail',
        orderReceived: ordersBaseUrl + '/receive-order',
    },
};

export const ordersApiClient: OrdersApiClientInterface =
    new OrdersApiClientModel(options);
