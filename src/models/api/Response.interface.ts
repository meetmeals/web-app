/**
 * @name ResponseInterface
 * @description Interface to show general API response format
 */
export interface ResponseInterface<T> {
    data: T;
    status: number;
    message: string;
}
