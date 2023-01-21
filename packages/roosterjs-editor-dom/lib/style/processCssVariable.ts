const VARIABLE_REGEX = /^\s*var\(\s*(\-\-[a-zA-Z0-9\-_]+)\s*(?:,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';

/**
 * Handle CSS variable format. e.g.: var(--name, fallbackValue)
 * Return an array of regular expression parse result:
 * [0]: Original string (if match)
 * [1]: variable name (start with "--")
 * [2]: fallback value
 * Or null if not match
 */
export function processCssVariable(value: string): RegExpExecArray | null {
    return VARIABLE_REGEX.exec(value);
}

export function createCssVariable(key: string, value: string): string {
    return `var(${key},${value})`;
}

export function createCssVariableKey(value: string, prefix: string): string {
    return `--${prefix}${value.replace(/[^\d\w]/g, '_')}`;
}

/**
 * @internal
 */
export function isCssVariable(value: string): boolean {
    return value.indexOf(VARIABLE_PREFIX) == 0;
}
