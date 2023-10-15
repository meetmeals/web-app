import { ApiResponse } from 'models/common';

export interface SatisfactionTotalRequestInterface {
    total_satisfaction: number;
    package_id: number;
    order_id: number;
}

export interface SatisfactionTotalResponseInterface extends ApiResponse {
    data: {
        user_id: number;
        package_id: string;
        order_id: string;
        total_satisfaction: string;
        food_quality: number;
        food_volume: number;
        seller_encounter: number;
        updated_at: string;
        created_at: string;
        id: number;
    };
    message: string;
}
