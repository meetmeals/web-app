/**
 * @name AccountApiClientEndpoints
 * @description Interface to wrap all auth-related URLs
 */
export interface AccountApiClientEndpoints {
    profile: string;
    orders: string;
    favorites: string;
    comments: string;
}

/**
 * @name AccountApiClientOptions
 * @description Interface to wrap Account API client options
 */
export interface AccountApiClientOptions {
    mockDelay?: number;
    endpoints: AccountApiClientEndpoints;
}
