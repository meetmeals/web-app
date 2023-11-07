import { ApiResponse, BooleanEnum, NullableString } from 'models/common';

export interface FilterPackage {
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
    restaurant_phone: string;
    logo: string;
    ready_to_eat: number;
    offset_time: string;
    commission: number;
    restaurant_desc: string;
    restaurant_id: number;
    diet_preference_id: number;
    diet_preference_title: string;
    main_price: number;
    offer_price: number;
    food_img: string;
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
    package_finished_time: string;
    satisfaction: NullableString;
    distance: number;
    is_like: number;
}

export enum CustomerPreference {
    Vegetarian = 1,
    Vegan = 2,
    Other = 3,
}

export enum Materials {
    Food = 1,
    Bakery = 2,
    Market = 3,
    Other = 4,
}

export interface FilterRequestInterface {
    end_time?: string;
    limit?: number;
    offset?: number;
    start_time?: string;
    text_input?: string;
    containing_package?: BooleanEnum;
    customer_preference?: CustomerPreference;
    materials?: Array<Materials>;
    package_type?: Array<number>;
    not_available_packages?: number;
}

export interface FilterResponseInterface extends ApiResponse {
    has_next_page: boolean;
    data: Array<FilterPackage>;
    message: string;
}
