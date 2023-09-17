/**
 * @name AuthApiClientEndpoints
 * @description Interface to wrap all auth-related URLs
 */
export interface AuthApiClientEndpoints {
    login: string;
    verifyLogin: string;
    register: string;
}

/**
 * @name AuthApiClientOptions
 * @description Interface to wrap Auth API client options
 */
export interface AuthApiClientOptions {
    mockDelay?: number;
    endpoints: AuthApiClientEndpoints;
}
