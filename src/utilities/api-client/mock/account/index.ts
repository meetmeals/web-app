import {
    AccountApiClientInterface,
    AccountApiClientModel,
    AccountApiClientOptions,
} from 'utilities/api-client/models/account';

const accountBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/mock-data/account`;

const options: AccountApiClientOptions = {
    endpoints: {
        profile: accountBaseUrl + '/profile',
        editProfile: accountBaseUrl + '/user-profile-edit',
    },
};

export const accountApiClient: AccountApiClientInterface =
    new AccountApiClientModel(options);
