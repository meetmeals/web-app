import {
  ProductsApiClientOptions,
  ProductsApiClientInterface,
  ProductsApiClientModel,
} from 'utilities/api-client/models/products';

const productsBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/mock-data/products`;

const options: ProductsApiClientOptions = {
  endpoints: {
    fetchProducts: `${productsBaseUrl}/products.json`,
  },
  mockDelay: 1000,
};

export const productsApiClient: ProductsApiClientInterface =
  new ProductsApiClientModel(options);
