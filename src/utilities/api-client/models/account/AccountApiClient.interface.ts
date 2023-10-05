import { UserProfileResponseInterface } from 'models/account';

/**
 * @name AccountApiClientInterface
 * @description Interface for the Account API client module
 */
export interface AccountApiClientInterface {
    profile: (headers: object) => Promise<UserProfileResponseInterface>;
    orders: (body: object) => Promise<object>;
    favorites: (body: object) => Promise<object>;
    comments: (body: object) => Promise<object>;
}
