import {
    ProductsApiClientOptions,
    ProductsApiClientInterface,
    ProductsApiClientModel,
} from 'utilities/api-client/models/products';

const productsBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/products`;

const options: ProductsApiClientOptions = {
    endpoints: {
        fetchProducts: productsBaseUrl,
    },
};

export const productsApiClient: ProductsApiClientInterface =
    new ProductsApiClientModel(options);
