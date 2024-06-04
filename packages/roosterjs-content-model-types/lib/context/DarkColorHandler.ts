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
    darkModeColor: string;
}

/**
 * A util function type to transform light mode color to dark mode color
 * Default value is to return the original light color
 * @param lightColor Source color string in light mode
 * @param baseLValue Base value of light used for dark value calculation
 * @param colorType @optional Type of color, can be text, background, or border
 * @param element @optional Source HTML element of the color
 * @param defaultDarkColor @optional An existing value of dark color. The callback implementation can choose to return it directly
 * if exist, or generate a new one according to its requirement
 */
export type ColorTransformFunction = (
    lightColor: string,
    baseLValue?: number,
    colorType?: 'text' | 'background' | 'border',
    element?: HTMLElement,
    defaultDarkColor?: string
) => string;

/**
 * A handler object for dark color, used for variable-based dark color solution
 */
export interface DarkColorHandler {
    /**
     * Map of known colors
     */
    readonly knownColors: Record<string, Colors>;

    /**
     * Map of known colors
     */
    readonly alwaysGetDarkColor: boolean;

    /**
     * Update all known colors to root container.
     * @param isDarkMode Whether container is in dark mode. When in dark mode, we add CSS color variables for all known colors.
     * When in light mode, we will remove all those CSS color variables
     */
    updateKnownColor(isDarkMode: boolean): void;

    /**
     * Register a known color, and update it to root container via CSS color variable when in dark mode
     * @param isDarkMode Whether container is in dark mode.
     * @param key The key of color, normally it is the name of color variable
     * @param colorPair A pair value of light color and dark color
     */
    updateKnownColor(isDarkMode: boolean, key: string, colorPair: Colors): void;

    /**
     * Reset known color record, clean up registered color variables.
     */
    reset(): void;

    /**
     * A util function to transform light mode color to dark mode color
     */
    getDarkColor: ColorTransformFunction;
}
