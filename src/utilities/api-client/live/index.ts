import { productsApiClient } from './products';
import { ApiClientInterface } from '../models/ApiClient.interface';

export const apiLiveClient: ApiClientInterface = {
    products: productsApiClient,
};
