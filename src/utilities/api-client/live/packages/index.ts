import {
    PackagesApiClientOptions,
    PackagesApiClientInterface,
    PackagesApiClientModel,
} from 'utilities/api-client/models/packages';

const packagesBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: PackagesApiClientOptions = {
    endpoints: {
        filter: packagesBaseUrl + '/filter',
        surfing: packagesBaseUrl + '/surfing',
        packageLike: packagesBaseUrl + '/package-like',
        favorites: packagesBaseUrl + '/package-user-like',
        packageInfo: packagesBaseUrl + '/package-info',
    },
};

export const packagesApiClient: PackagesApiClientInterface =
    new PackagesApiClientModel(options);
