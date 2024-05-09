import type { MutableType } from 'roosterjs-content-model-types';

/**
 * @internal Convert readonly type to mutable type
 * !!! IMPORTANT PLEASE READ !!!
 * DO NOT USE THIS FUNCTION UNLESS YOU ARE CREATING A NEW INSTANCE OF MODEL
 * DO NOT EXPORT THIS FUNCTION TO PUBLIC
 * @param source The source readonly model
 * @returns Related mutable model
 */
export function internalConvertToMutableType<T>(source: T): MutableType<T> {
    return (source as unknown) as MutableType<T>;
}
