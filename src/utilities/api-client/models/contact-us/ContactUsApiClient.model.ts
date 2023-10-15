import { HttpMethodsEnum } from 'models/api';
import { SaveCustomerContactResponseInterface } from 'models/contact-us';

import { ContactUsApiClientInterface } from './ContactUsApiClient.interface';
import {
    ContactUsApiClientEndpoints,
    ContactUsApiClientOptions,
} from './ContactUsApiClientOptions.interface';

/**
 * @name ContactUsApiClientModel
 * @description Implements the ContactUsApiClientInterface
 */
export class ContactUsApiClientModel implements ContactUsApiClientInterface {
    private readonly endpoints!: ContactUsApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: ContactUsApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    saveCustomerContact(
        body: FormData,
    ): Promise<SaveCustomerContactResponseInterface> {
        return new Promise<SaveCustomerContactResponseInterface>((resolve) => {
            const endpoint = this.endpoints.saveCustomerContact;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                body: body,
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: SaveCustomerContactResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `ContactUsApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
}
