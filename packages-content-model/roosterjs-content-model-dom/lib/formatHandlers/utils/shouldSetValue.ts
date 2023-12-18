/**
 * @internal
 */
export function shouldSetValue(
    value: string | undefined,
    normalValue: string,
    existingValue: string | undefined,
    defaultValue: string | undefined
): boolean {
    return (
        !!value &&
        value != 'inherit' &&
        !!(value != normalValue || existingValue || (defaultValue && value != defaultValue))
    );
}
