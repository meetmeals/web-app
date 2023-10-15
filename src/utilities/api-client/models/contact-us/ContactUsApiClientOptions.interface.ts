/**
 * @name ContactUsApiClientEndpoints
 * @description Interface to wrap all contact-us-related URLs
 */
export interface ContactUsApiClientEndpoints {
    saveCustomerContact: string;
}

/**
 * @name ContactUsApiClientOptions
 * @description Interface to wrap ContactUs API client options
 */
export interface ContactUsApiClientOptions {
    mockDelay?: number;
    endpoints: ContactUsApiClientEndpoints;
}
