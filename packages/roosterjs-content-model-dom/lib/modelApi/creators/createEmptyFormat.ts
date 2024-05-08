import type { ContentModelFormatBase } from 'roosterjs-content-model-types';

/**
 * Create an empty mutable format object
 * @param format @optional The format of this model
 */
export function createEmptyFormat<T extends ContentModelFormatBase>(): T {
    // Do not do this kind of type cast other than creating a new object
    return {} as T;
}
