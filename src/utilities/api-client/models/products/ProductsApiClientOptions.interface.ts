/**
 * @name ProductsApiClientEndpoints
 * @description Interface to wrap all product-related URLs
 */
export interface ProductsApiClientEndpoints {
    fetchProducts: string;
}

/**
 * @name ProductsApiClientOptions
 * @description Interface to wrap Products API client options
 */
export interface ProductsApiClientOptions {
    mockDelay?: number;
    endpoints: ProductsApiClientEndpoints;
}
