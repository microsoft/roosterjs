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

    /**
     * Style elements used for adding CSS rules for editor
     */
    readonly styleElements: Record<string, HTMLStyleElement>;
}
