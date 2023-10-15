import {
    EditProfileResponseInterface,
    UserProfileResponseInterface,
} from 'models/account';

/**
 * @name AccountApiClientInterface
 * @description Interface for the Account API client module
 */
export interface AccountApiClientInterface {
    profile: (headers: object) => Promise<UserProfileResponseInterface>;
    editProfile: (
        body: FormData,
        headers: object,
    ) => Promise<EditProfileResponseInterface>;
}
