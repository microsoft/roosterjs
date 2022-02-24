/**
 * The state object for ColorChangedEventPlugin
 */
export default interface ColorChangedEventPluginState {
    /**
     * Content div
     */
    contentDiv: HTMLElement;
    /**
     * Returns if the editor is in dark mode
     */
    isDarkMode: boolean;
    /**
     * Calculate dark mode color from light mode color
     */
    getDarkColor: (lightColor: string) => string;
    /**
     * External content transform function to help do color transform for existing content
     */
    onExternalContentTransform: (htmlIn: HTMLElement) => void;
}
