import {
    AccountApiClientInterface,
    AccountApiClientModel,
    AccountApiClientOptions,
} from 'utilities/api-client/models/account';

const accountBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/mock-data/account`;

const options: AccountApiClientOptions = {
    endpoints: {
        profile: accountBaseUrl + '/profile',
        orders: accountBaseUrl + '/orders',
        favorites: accountBaseUrl + '/favorites',
        comments: accountBaseUrl + '/comments',
    },
};

export const accountApiClient: AccountApiClientInterface =
    new AccountApiClientModel(options);
