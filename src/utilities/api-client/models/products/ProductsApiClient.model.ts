import {
  ProductsApiClientOptions,
  ProductsApiClientEndpoints,
} from './ProductsApiClientOptions.interface';
import { ProductsApiClientInterface } from './ProductsApiClient.interface';
import { HttpMethodsEnum, MimeTypesEnum, ResponseInterface } from 'models/api';
import { ProductInterface } from 'models/products';

/**
 * @name ProductsApiClientModel
 * @description Implements the ProductsApiClientInterface
 */
export class ProductsApiClientModel implements ProductsApiClientInterface {
  private readonly endpoints!: ProductsApiClientEndpoints;
  private readonly mockDelay: number = 0;

  constructor(options: ProductsApiClientOptions) {
    this.endpoints = options.endpoints;
    if (options.mockDelay) {
      this.mockDelay = options.mockDelay;
    }
  }

  fetchProducts(): Promise<ProductInterface[]> {
    return new Promise<ProductInterface[]>((resolve) => {
      const endpoint = this.endpoints.fetchProducts;
      const requestOptions: RequestInit = {
        method: HttpMethodsEnum.GET,
        headers: {
          'Content-Type': MimeTypesEnum.APPLICATION_JSON,
        },
      };

      fetch(endpoint, requestOptions)
        .then((response) => response.json())
        .then((response: ResponseInterface<ProductInterface[]>) => {
          if (!this.mockDelay) {
            resolve(response.data);
          } else {
            setTimeout(() => {
              resolve(response.data);
            }, this.mockDelay);
          }
        })
        .catch((error) => {
          console.error('ProductsApiClient: HttpClient: GET Products:', error);
        });
    });
  }
}
