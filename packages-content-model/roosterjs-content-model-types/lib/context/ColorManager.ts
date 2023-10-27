/**
 * Represents a combination of color key, light color and dark color, parsed from existing color value
 */
export interface Colors {
    /**
     * Light mode color value
     */
    lightModeColor: string;

    /**
     * Dark mode color value, if found, otherwise undefined
     */
    darkModeColor?: string;
}

/**
 * A handler object for dark color, used for variable-based dark color solution
 */
export interface ColorManager {
    /**
     * Given a light mode color value and an optional dark mode color value, register this color
     * so that editor can handle it, then return the CSS color value for current color mode.
     * @param lightModeColor Light mode color value
     * @param isDarkMode Whether current color mode is dark mode
     */
    registerColor(lightModeColor: string, isDarkMode: boolean): string;

    /**
     * Parse an existing color value, if it is in variable-based color format, extract color key,
     * light color and query related dark color if any
     * @param color The color string to parse
     * @param isInDarkMode Whether current content is in dark mode. When set to true, if the color value is not in dark var format,
     * we will treat is as a dark mode color and try to find a matched dark mode color.
     */
    parseColorValue(color: string | null | undefined, isInDarkMode?: boolean): Colors;

    /**
     * Reset known color record, clean up registered color variables.
     */
    reset(): void;
}
