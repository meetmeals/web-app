import { ConstantTextResponseInterface } from 'models/constant-text';

/**
 * @name ConstantTextApiClientInterface
 * @description Interface for the ConstantText API client module
 */
export interface ConstantTextApiClientInterface {
    default: (headers: object) => Promise<ConstantTextResponseInterface>;
}
