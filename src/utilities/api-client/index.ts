import { ApiClientInterface } from './models/ApiClient.interface';
import { apiLiveClient } from './live';
import { apiMockClient } from './mock';

const apiClientType: string = process.env.REACT_APP_API_CLIENT || 'mock';
let apiClient: ApiClientInterface;

if (apiClientType === 'mock') apiClient = apiMockClient;
else apiClient = apiLiveClient;

export default apiClient;
