import { SaveCustomerContactResponseInterface } from 'models/contact-us';

/**
 * @name ContactUsApiClientInterface
 * @description Interface for the ContactUs API client module
 */
export interface ContactUsApiClientInterface {
    saveCustomerContact: (
        body: FormData,
    ) => Promise<SaveCustomerContactResponseInterface>;
}
