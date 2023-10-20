import { ApiResponse, NullableNumber, NullableString } from 'models/common';

export interface InfoPackage {
    fa_title: string;
    en_title: string;
    id: number;
    meal_id: number;
    PackageName: string;
    restaurant_name: string;
    lat: string;
    long: string;
    state: string;
    city: string;
    restaurant_address: string;
    restaurant_phone: NullableString;
    logo: NullableString;
    ready_to_eat: number;
    offset_time: NullableString;
    commission: NullableNumber;
    restaurant_desc: string;
    restaurant_id: number;
    diet_preference_id: number;
    diet_preference_title: string;
    main_price: number;
    offer_price: number;
    food_img: NullableString;
    desc: string;
    material: number;
    ingredients: string;
    mealName: string;
    is_open: number;
    package_count: number;
    start_time: string;
    end_time: string;
    orderCount: number;
    is_today: number;
    remindPackage: number;
    end_time_str: string;
    status: number;
    package_finished_time: NullableString;
    is_like: number;
}

export interface PackageInfoSatisfaction {
    total_text: string;
    food_volume: string;
    food_quality: string;
    seller_encounter: string;
    total_opinion_count: number;
    show_rate_count: boolean;
}

export interface PackageInfoResponseInterface extends ApiResponse {
    data: InfoPackage;
    satisfaction: PackageInfoSatisfaction;
    user_wallet: NullableString;
    message: string;
}
