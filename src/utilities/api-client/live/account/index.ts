import {
    AccountApiClientInterface,
    AccountApiClientModel,
    AccountApiClientOptions,
} from 'utilities/api-client/models/account';

const accountBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: AccountApiClientOptions = {
    endpoints: {
        profile: accountBaseUrl + '/user-profile',
        orders: accountBaseUrl + '/order-list',
        favorites: accountBaseUrl + '/package-user-like',
        comments: accountBaseUrl + '/user-comments',
    },
};

export const accountApiClient: AccountApiClientInterface =
    new AccountApiClientModel(options);
