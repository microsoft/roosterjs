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

/**
 * Create CSS variable string from given key and fallback value
 * @param name The name of the CSS variable, must start with "--"
 * @param fallbackValue Fallback value of the CSS variable
 * @returns The CSS variable string
 */
export function createCssVariable(name: string, fallbackValue: string): string {
    return `var(${name},${fallbackValue})`;
}

/**
 * Create CSS variable name with given var name and prefix
 * @param varName Variable name (no need to add prefix "--", this function will handle it)
 * @param prefix Variable prefix (no need to add prefix "--", this function will handle it)
 * @returns The CSS variable name
 */
export function createCssVariableName(varName: string, prefix: string): string {
    return `--${prefix}${varName.replace(/[^\d\w]/g, '_')}`;
}

/**
 * @internal
 */
export function isCssVariable(value: string): boolean {
    return value.indexOf(VARIABLE_PREFIX) == 0;
}
