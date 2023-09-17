import { ApiResponse } from 'models/common';

export interface RegisterRequestInterface {
    fName: string;
    lName: string;
    username: string;
}

export interface RegisterResponseInterface extends ApiResponse {
    username: string;
    message: string;
}
