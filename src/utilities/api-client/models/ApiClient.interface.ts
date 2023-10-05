import { AccountApiClientInterface } from './account';
import { AuthApiClientInterface } from './auth';
import { OrdersApiClientInterface } from './orders';
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
    orders: OrdersApiClientInterface;
    account: AccountApiClientInterface;
}
