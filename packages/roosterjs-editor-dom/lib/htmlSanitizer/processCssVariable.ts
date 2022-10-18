const VARIABLE_REGEX = /^\s*var\(\s*[a-zA-Z0-9-_]+\s*(,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';

/**
 * @internal
 * Handle CSS variable format. e.g.: var(--name, fallbackValue)
 */
export function processCssVariable(value: string): string {
    const match = VARIABLE_REGEX.exec(value);
    return match?.[2] || ''; // Without fallback value, we don't know what does the original value mean, so ignore it
}

/**
 * @internal
 */
export function isCssVariable(value: string): boolean {
    return value.indexOf(VARIABLE_PREFIX) == 0;
}
