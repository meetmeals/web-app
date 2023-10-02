import { ApiResponse } from 'models/common';

export interface PackageLikeRequestInterface {
    package_id: number;
}

export interface PackageLikeResponseInterface extends ApiResponse {
    message: string;
}
