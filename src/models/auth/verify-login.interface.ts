import { ApiResponse, NullableString } from 'models/common';

export interface VerifyLoginRequestInterface {
    otp: string;
    username: string;
}

export interface VerifyLoginResponseInterface extends ApiResponse {
    data?: {
        token: string;
        userInfo: {
            username: string;
            fName: NullableString;
            lName: NullableString;
            userImage: NullableString;
            email: string;
            mobile: string;
        };
    };
    message: string;
}
