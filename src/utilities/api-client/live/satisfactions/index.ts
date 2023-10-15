import {
    SatisfactionsApiClientInterface,
    SatisfactionsApiClientModel,
    SatisfactionsApiClientOptions,
} from 'utilities/api-client/models/satisfactions';

const satisfactionsBaseUrl = `${process.env.REACT_APP_BASE_API_URL}/customer`;

const options: SatisfactionsApiClientOptions = {
    endpoints: {
        satisfactionDetail: satisfactionsBaseUrl + '/satisfaction-detail',
        satisfactionTotal: satisfactionsBaseUrl + '/satisfaction-total',
        satisfactionDesc: satisfactionsBaseUrl + '/satisfaction-desc',
        satisfactionList: satisfactionsBaseUrl + '/satisfaction-list',
    },
};

export const satisfactionsApiClient: SatisfactionsApiClientInterface =
    new SatisfactionsApiClientModel(options);
