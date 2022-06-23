import getObjectKeys from '../jsUtils/getObjectKeys';

function nativeClone<T>(
    source: Record<string, T> | null | undefined,
    existingObj?: Record<string, T>
): Record<string, T> {
    return Object.assign(existingObj || {}, source);
}

function customClone<T>(
    source: Record<string, T> | null | undefined,
    existingObj?: Record<string, T>
): Record<string, T> {
    let result: Record<string, T> = existingObj || {};
    if (source) {
        for (let key of getObjectKeys(source)) {
            result[key] = source[key];
        }
    }
    return result;
}

// @ts-ignore Ignore this error for IE compatibility
const cloneObjectImpl = Object.assign ? nativeClone : customClone;

/**
 * @internal
 */
export function cloneObject<T>(
    source: Record<string, T> | null | undefined,
    existingObj?: Record<string, T>
): Record<string, T> {
    return cloneObjectImpl(source, existingObj);
}
