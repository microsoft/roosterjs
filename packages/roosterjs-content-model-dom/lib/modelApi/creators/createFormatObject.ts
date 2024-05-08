import type { ContentModelFormatBase } from 'roosterjs-content-model-types';

/**
 * Create an empty mutable format object
 * @param format @optional The format of this model
 */
export function createFormatObject<T extends ContentModelFormatBase>(
    ...existingFormats: (Partial<T> | undefined)[]
): T {
    // Do not do this kind of type cast other than creating a new object
    return (existingFormats.length > 0 ? Object.assign({}, ...existingFormats) : {}) as T;
}
