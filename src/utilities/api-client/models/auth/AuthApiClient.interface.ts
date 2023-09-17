import {
    LoginRequestInterface,
    LoginResponseInterface,
    RegisterRequestInterface,
    RegisterResponseInterface,
    VerifyLoginRequestInterface,
    VerifyLoginResponseInterface,
} from 'models/auth';

/**
 * @name AuthApiClientInterface
 * @description Interface for the Auth API client module
 */
export interface AuthApiClientInterface {
    login: (body: LoginRequestInterface) => Promise<LoginResponseInterface>;
    verifyLogin: (
        body: VerifyLoginRequestInterface,
    ) => Promise<VerifyLoginResponseInterface>;
    register: (
        body: RegisterRequestInterface,
    ) => Promise<RegisterResponseInterface>;
}
