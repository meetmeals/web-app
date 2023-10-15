import {
    SatisfactionDescRequestInterface,
    SatisfactionDescResponseInterface,
    SatisfactionDetailRequestInterface,
    SatisfactionDetailResponseInterface,
    SatisfactionListResponseInterface,
    SatisfactionTotalRequestInterface,
    SatisfactionTotalResponseInterface,
} from 'models/satisfactions';

/**
 * @name SatisfactionsApiClientInterface
 * @description Interface for the Satisfactions API client module
 */
export interface SatisfactionsApiClientInterface {
    satisfactionDetail: (
        body: SatisfactionDetailRequestInterface,
        headers: object,
    ) => Promise<SatisfactionDetailResponseInterface>;
    satisfactionTotal: (
        body: SatisfactionTotalRequestInterface,
        headers: object,
    ) => Promise<SatisfactionTotalResponseInterface>;
    satisfactionDesc: (
        body: SatisfactionDescRequestInterface,
        headers: object,
    ) => Promise<SatisfactionDescResponseInterface>;
    satisfactionList: (
        headers: object,
        page: number,
    ) => Promise<SatisfactionListResponseInterface>;
}
