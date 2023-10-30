import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
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
 * @internal
 * The state object for ContentModelLifecyclePlugin
 */
export interface ContentModelLifecyclePluginState {
    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

    /**
     * Default format of this editor
     */
    defaultFormat: ContentModelSegmentFormat;

    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Calculate dark mode color from light mode color
     */
    getDarkColor: (lightColor: string) => string;

    /**
     * Whether editor is in shadow edit state
     */
    isInShadowEdit: boolean;
}
