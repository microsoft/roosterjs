/**
 * @internal
 */
export function cloneObject<T>(
    source: Record<string, T> | null | undefined,
    existingObj?: Record<string, T>
): Record<string, T> {
    return Object.assign(existingObj || {}, source);
}
