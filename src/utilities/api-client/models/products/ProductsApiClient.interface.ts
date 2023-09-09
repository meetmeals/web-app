import { ProductInterface } from 'models/products';

/**
 * @name ProductsApiClientInterface
 * @description Interface for the Products API client module
 */
export interface ProductsApiClientInterface {
    fetchProducts: () => Promise<ProductInterface[]>;
}
