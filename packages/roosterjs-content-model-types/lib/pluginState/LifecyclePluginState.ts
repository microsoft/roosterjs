/**
 * The state object for LifecyclePlugin
 */
export interface LifecyclePluginState {
    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Cached document fragment for original content
     */
    shadowEditFragment: DocumentFragment | null;
}
