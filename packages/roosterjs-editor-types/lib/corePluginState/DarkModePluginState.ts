/**
 * The state object for DarkModePlugin
 */
export default interface DarkModePluginState {
    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;

    /**
     * External content transform function to help do color transform for existing content
     */
    onExternalContentTransform: (htmlIn: HTMLElement) => void;
}
