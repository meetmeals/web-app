import { AuthApiClientInterface } from './auth';
import { ProductsApiClientInterface } from './products';

/**
 * @name ApiClientInterface
 * @description The interface to wrap all API client modules
 */
export interface ApiClientInterface {
    products: ProductsApiClientInterface;
    auth: AuthApiClientInterface;
}
