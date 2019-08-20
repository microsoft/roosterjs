interface ModeIndependentColor {
    /**
     * The color to be used in dark mode, if enabled.
     */
    darkModeColor: string;

    /**
     * The color to be used in light mode, or stored as the original color in dark mode.
     */
    lightModeColor: string;
}

export default ModeIndependentColor;
