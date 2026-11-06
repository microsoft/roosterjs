import type { SelectionPluginState } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const RANGE_SELECTION_CSS_KEY = '_RangeSelection';

/**
 * @internal
 * Get the text selection style for the current color mode, or null to use browser defaults.
 */
export function getTextSelectionStyle(
    state: SelectionPluginState,
    isDarkMode: boolean
): string | null {
    const color = isDarkMode ? state.textSelectionColorDark : state.textSelectionColor;

    return color ? `background-color: ${color} !important; color: currentColor !important;` : null;
}
