/**
 * A color object contains both light mode and dark mode color
 */
export default interface ModeIndependentColor {
    /**
     * The color to be used in dark mode, if enabled.
     */
    darkModeColor: string;

    /**
     * The color to be used in light mode, or stored as the original color in dark mode.
     */
    lightModeColor: string;
}
