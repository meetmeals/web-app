import { AccountApiClientInterface } from './account';
import { AuthApiClientInterface } from './auth';
import { ConstantTextApiClientInterface } from './constant-text';
import { ContactUsApiClientInterface } from './contact-us';
import { OrdersApiClientInterface } from './orders';
import { PackagesApiClientInterface } from './packages';
import { ProductsApiClientInterface } from './products';
import { SatisfactionsApiClientInterface } from './satisfactions';

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
    constantText: ConstantTextApiClientInterface;
    satisfactions: SatisfactionsApiClientInterface;
    contactUs: ContactUsApiClientInterface;
}
