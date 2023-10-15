import { ApiResponse, NullableNumber, NullableString } from 'models/common';

export interface OrderInterface {
    order_id: number;
    package_id: number;
    status: string;
    restaurant_id: number;
    delivery_date: NullableString;
    restaurant_name: string;
    logo: NullableString;
    date: string;
    total_satisfaction: NullableNumber;
    package_name: string;
    food_img: string;
}

export interface OrdersResponseInterface extends ApiResponse {
    data: {
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: string;
        last_page_url: string;
        next_page_url: NullableString;
        path: string;
        per_page: number;
        prev_page_url: NullableString;
        to: number;
        totall: number;
        data: Array<OrderInterface>;
    };
    message: string;
}
