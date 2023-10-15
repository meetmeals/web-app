/**
 * @name SatisfactionsApiClientEndpoints
 * @description Interface to wrap all satisfaction-related URLs
 */
export interface SatisfactionsApiClientEndpoints {
    satisfactionDetail: string;
    satisfactionTotal: string;
    satisfactionDesc: string;
    satisfactionList: string;
}

/**
 * @name SatisfactionsApiClientOptions
 * @description Interface to wrap Satisfactions API client options
 */
export interface SatisfactionsApiClientOptions {
    mockDelay?: number;
    endpoints: SatisfactionsApiClientEndpoints;
}
