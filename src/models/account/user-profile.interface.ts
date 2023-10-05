import { ApiResponse } from 'models/common';

export interface ProfileUser {
    id: number;
    username: string;
    fName: string;
    lName: string;
    userImage: string;
    email: string;
    mobile: string;
    user_code: number;
    post_code: string;
    notification: number;
    news_letter_status: number;
    last_order_date: string;
    account_number: number;
}

export interface UserProfileResponseInterface extends ApiResponse {
    user: ProfileUser;
    last_open_order: string;
    user_wallet: number;
    message: string;
}
