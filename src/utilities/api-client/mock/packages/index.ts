import {
    PackagesApiClientInterface,
    PackagesApiClientModel,
    PackagesApiClientOptions,
} from 'utilities/api-client/models/packages';

const packagesBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/mock-data/packages`;

const options: PackagesApiClientOptions = {
    endpoints: {
        filter: packagesBaseUrl + '/filter',
        surfing: packagesBaseUrl + '/surfing',
        packageLike: packagesBaseUrl + '/package-like',
    },
};

export const packagesApiClient: PackagesApiClientInterface =
    new PackagesApiClientModel(options);
