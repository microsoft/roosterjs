import type { ContentModelFormatBase } from 'roosterjs-content-model-types';

/**
 * Create a mutable format object
 * @param existingFormats @optional An array of existing format values that will be copied into the target format object.
 * If not passed, this will return an empty format object
 */
export function createFormatObject<T extends ContentModelFormatBase>(
    ...existingFormats: (Partial<T> | undefined)[]
): T {
    // Do not do this kind of type cast other than creating a new object
    return (existingFormats.length > 0 ? Object.assign({}, ...existingFormats) : {}) as T;
}
