import { ApiResponse } from 'models/common';

export interface LoginRequestInterface {
    username: string;
}

export interface LoginResponseInterface extends ApiResponse {
    username: string;
    message: string;
}
