import { ApiResponse, NullableString } from 'models/common';

export interface SatisfactionDescRequestInterface {
    desc_satisfaction: string;
    package_id: number;
    order_id: number;
}

export interface SatisfactionDescResponseInterface extends ApiResponse {
    data: {
        id: number;
        user_id: number;
        package_id: number;
        order_id: number;
        food_quality: number;
        food_volume: number;
        seller_encounter: number;
        total_satisfaction: number;
        desc_satisfaction: NullableString;
        created_at: string;
        updated_at: string;
    };
    message: string;
}
