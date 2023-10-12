/**
 * @name ConstantTextApiClientEndpoints
 * @description Interface to wrap all package-related URLs
 */
export interface ConstantTextApiClientEndpoints {
    default: string;
}

/**
 * @name ConstantTextApiClientOptions
 * @description Interface to wrap ConstantText API client options
 */
export interface ConstantTextApiClientOptions {
    mockDelay?: number;
    endpoints: ConstantTextApiClientEndpoints;
}
