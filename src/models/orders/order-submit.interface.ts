import { ApiResponse } from 'models/common';

export interface OrderSubmitRequestInterface {
    package_id: number;
    package_count: number;
    user_os: string;
}

export interface OrderSubmitResponseInterface extends ApiResponse {
    data: {
        order: {
            user_id: number;
            package_id: number;
            order_number: string;
            date: string;
            start_time: string;
            end_time: string;
            user_platform: string;
            status: number;
            package_date: string;
            count_of_package: string;
            initial_count: string;
            total_price: number;
            customer_wallet: number;
            commission: number;
            updated_at: string;
            created_at: string;
            id: number;
            authority: string;
        };
        payment: {
            id: string;
            client_secret: string;
        };
    };
    message: string;
}
