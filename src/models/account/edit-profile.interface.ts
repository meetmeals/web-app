import { ApiResponse, NullableString } from 'models/common';

export interface EditProfileRequestInterface {
    fName: string;
    lName: string;
    mobile: string;
    userImage: object;
}

export interface EditProfileResponseInterface extends ApiResponse {
    user: {
        id: number;
        user_id: number;
        notification: number;
        account_number: number;
        country: string;
        userImage: NullableString;
    };
    message: string;
}
