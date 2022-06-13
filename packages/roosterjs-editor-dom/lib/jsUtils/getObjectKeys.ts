/**
 * Provide a strong-typed version of Object.keys()
 * @param obj The source object
 * @returns Array of keys
 */
export default function getObjectKeys<T extends string | number | symbol>(
    obj: Record<T, any> | Partial<Record<T, any>>
): T[] {
    return Object.keys(obj) as T[];
}
