import { HttpMethodsEnum, MimeTypesEnum } from 'models/api';
import {
    LoginRequestInterface,
    LoginResponseInterface,
    RegisterRequestInterface,
    RegisterResponseInterface,
    VerifyLoginRequestInterface,
    VerifyLoginResponseInterface,
} from 'models/auth';
import { AuthApiClientInterface } from './AuthApiClient.interface';
import {
    AuthApiClientEndpoints,
    AuthApiClientOptions,
} from './AuthApiClientOptions.interface';

/**
 * @name AuthApiClientModel
 * @description Implements the AuthApiClientInterface
 */
export class AuthApiClientModel implements AuthApiClientInterface {
    private readonly endpoints!: AuthApiClientEndpoints;
    private readonly mockDelay: number = 0;

    constructor(options: AuthApiClientOptions) {
        this.endpoints = options.endpoints;
        if (options.mockDelay) this.mockDelay = options.mockDelay;
    }

    login(body: LoginRequestInterface): Promise<LoginResponseInterface> {
        return new Promise<LoginResponseInterface>((resolve) => {
            const endpoint = this.endpoints.login;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                },
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: LoginResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `AuthApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    verifyLogin(
        body: VerifyLoginRequestInterface,
    ): Promise<VerifyLoginResponseInterface> {
        return new Promise<VerifyLoginResponseInterface>((resolve) => {
            const endpoint = this.endpoints.verifyLogin;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                },
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: VerifyLoginResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `AuthApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }

    register(
        body: RegisterRequestInterface,
    ): Promise<RegisterResponseInterface> {
        return new Promise<RegisterResponseInterface>((resolve) => {
            const endpoint = this.endpoints.register;
            const requestOptions: RequestInit = {
                method: HttpMethodsEnum.POST,
                headers: {
                    'Content-Type': MimeTypesEnum.APPLICATION_JSON,
                },
                body: JSON.stringify(body),
            };

            fetch(endpoint, requestOptions)
                .then((response) => response.json())
                .then((result: RegisterResponseInterface) => {
                    if (!this.mockDelay) resolve(result);
                    else
                        setTimeout(() => {
                            resolve(result);
                        }, this.mockDelay);
                })
                .catch((error) => {
                    console.error(
                        `AuthApiClient: HttpClient: ${requestOptions.method} ${endpoint}:`,
                        error,
                    );
                });
        });
    }
}
