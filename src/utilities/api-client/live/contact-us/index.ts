import {
    ContactUsApiClientInterface,
    ContactUsApiClientModel,
    ContactUsApiClientOptions,
} from 'utilities/api-client/models/contact-us';

const contactUsBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: ContactUsApiClientOptions = {
    endpoints: {
        saveCustomerContact: contactUsBaseUrl + '/save-customer-contact',
    },
};

export const contactUsApiClient: ContactUsApiClientInterface =
    new ContactUsApiClientModel(options);
