/**
 * Custom data stored in editor
 */
export interface CustomData {
    /**
     * Value of this custom data
     */
    value: any;

    /**
     * Optional disposer function of the custom data.
     * When a valid value is set, it will be invoked when editor is disposing
     */
    disposer?: (value: any) => void;
}

/**
 * Plugin state for ContentModelFormatPlugin
 */
export interface ContentModelLifecyclePluginState {
    /**
     * Default format of this editor
     */
    isInShadowEdit?: boolean;

    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;
}
