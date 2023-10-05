import { productsApiClient } from './products';
import { ApiClientInterface } from '../models/ApiClient.interface';
import { authApiClient } from './auth';
import { packagesApiClient } from './packages';
import { ordersApiClient } from './orders';
import { accountApiClient } from './account';

export const apiMockClient: ApiClientInterface = {
    auth: authApiClient,
    products: productsApiClient,
    packages: packagesApiClient,
    orders: ordersApiClient,
    account: accountApiClient,
};
