import {
    AuthApiClientInterface,
    AuthApiClientModel,
    AuthApiClientOptions,
} from 'utilities/api-client/models/auth';

const authBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: AuthApiClientOptions = {
    endpoints: {
        register: authBaseUrl + '/register',
        login: authBaseUrl + '/login',
        verifyLogin: authBaseUrl + '/verify-login',
    },
};

export const authApiClient: AuthApiClientInterface = new AuthApiClientModel(
    options,
);
