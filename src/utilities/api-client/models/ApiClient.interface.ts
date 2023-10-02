import { AuthApiClientInterface } from './auth';
import { PackagesApiClientInterface } from './packages';
import { ProductsApiClientInterface } from './products';

/**
 * @name ApiClientInterface
 * @description The interface to wrap all API client modules
 */
export interface ApiClientInterface {
    products: ProductsApiClientInterface;
    auth: AuthApiClientInterface;
    packages: PackagesApiClientInterface;
}
