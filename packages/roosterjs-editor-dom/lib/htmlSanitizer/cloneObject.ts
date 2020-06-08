function nativeClone<T>(
    source: Record<string, T>,
    existingObj?: Record<string, T>
): Record<string, T> {
    return Object.assign(existingObj || {}, source);
}

function customClone<T>(
    source: Record<string, T>,
    existingObj?: Record<string, T>
): Record<string, T> {
    let result: Record<string, T> = existingObj || {};
    if (source) {
        for (let key of Object.keys(source)) {
            result[key] = source[key];
        }
    }
    return result;
}

/**
 * @internal
 */
export const cloneObject = Object.assign ? nativeClone : customClone;
