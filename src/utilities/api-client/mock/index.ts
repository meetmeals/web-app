import { productsApiClient } from './products';
import { ApiClientInterface } from '../models/ApiClient.interface';

export const apiMockClient: ApiClientInterface = {
    products: productsApiClient,
};
