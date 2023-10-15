import { ApiResponse, NullableNumber, NullableString } from 'models/common';

export interface OrderDetailsRequestInterface {
    order_id: string;
}

export interface OrderDetailsInterface {
    authority: string;
    cancel_reason_text: string;
    changed_time_at: string;
    comission: number;
    count_of_package: string;
    created_at: string;
    customer_satisfactions_id: NullableNumber;
    customer_wallet: number;
    date: string;
    deleted_at: NullableString;
    delivery_date: string;
    desc_satisfaction: NullableString;
    edited_at: NullableString;
    end_time: string;
    food_img: NullableString;
    food_quality: NullableString;
    food_volume: NullableString;
    id: number;
    initial_count: number;
    logo: NullableString;
    order_number: string;
    order_status: string;
    package_date: string;
    package_id: number;
    package_name: string;
    restaurant_address: string;
    restaurant_name: string;
    seller_encounter: NullableString;
    start_time: string;
    status: string;
    total_price: number;
    total_satisfaction: NullableNumber;
    updated_at: NullableString;
    user_id: number;
    user_platform: string;
}

export interface OrderDetailsResponseInterface extends ApiResponse {
    data: OrderDetailsInterface;
    message: string;
}
