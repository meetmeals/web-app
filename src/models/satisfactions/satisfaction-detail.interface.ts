import { ApiResponse } from 'models/common';

export interface SatisfactionDetailRequestInterface {
    food_quality: number;
    food_volume: number;
    seller_encounter: number;
    package_id: number;
    order_id: number;
}

export interface SatisfactionDetailResponseInterface extends ApiResponse {
    data: null;
    message: string;
}
