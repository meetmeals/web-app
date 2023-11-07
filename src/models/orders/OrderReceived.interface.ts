import { ApiResponse, NullableString } from 'models/common';

export interface OrderReceivedInterface {
    id: number;
    user_id: number;
    package_id: number;
    order_number: string;
    date: string;
    start_time: string;
    end_time: string;
    user_platform: string;
    status: string;
    count_of_package: string;
    total_price: number;
    commission: number;
    customer_wallet: number;
    delivery_date: string;
    changed_time_at: NullableString;
    deleted_at: null;
    created_at: string;
    updated_at: string;
    package_date: string;
    reason_id: NullableString;
    notification_status: number;
    authority: string;
    edited_at: NullableString;
    initial_count: number;
    restaurant_name: string;
    restaurant_address: string;
    package_name: string;
}

export interface OrderReceivedResponseInterface extends ApiResponse {
    data: OrderReceivedInterface;
    message: string;
}
