import { productsApiClient } from './products';
import { ApiClientInterface } from '../models/ApiClient.interface';
import { authApiClient } from './auth';

export const apiMockClient: ApiClientInterface = {
    auth: authApiClient,
    products: productsApiClient,
};
