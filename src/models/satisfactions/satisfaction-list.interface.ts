import { ApiResponse, NullableString } from 'models/common';

export interface SatisfactionInterface {
    id: number;
    order_number: string;
    total_price: number;
    date: string;
    restaurant_name: string;
    logo: NullableString;
    total_satisfaction: number;
    desc_satisfaction: string;
}

export interface SatisfactionListResponseInterface extends ApiResponse {
    data: {
        current_page: number;
        data: Array<SatisfactionInterface>;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: null;
        path: string;
        per_page: number;
        prev_page_url: NullableString;
        to: number;
        total: number;
    };
}
