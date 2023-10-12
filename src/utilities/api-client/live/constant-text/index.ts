import {
    ConstantTextApiClientInterface,
    ConstantTextApiClientModel,
    ConstantTextApiClientOptions,
} from 'utilities/api-client/models/constant-text';

const constantTextBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: ConstantTextApiClientOptions = {
    endpoints: {
        default: constantTextBaseUrl + '/constant-text',
    },
};

export const constantTextApiClient: ConstantTextApiClientInterface =
    new ConstantTextApiClientModel(options);
