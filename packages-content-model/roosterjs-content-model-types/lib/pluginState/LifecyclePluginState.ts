import type { DarkColorHandler, DefaultFormat, ExperimentalFeatures } from 'roosterjs-editor-types';

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
     * Calculate dark mode color from light mode color
     */
    getDarkColor: (lightColor: string) => string;

    /**
     * External content transform function to help do color transform for existing content
     */
    onExternalContentTransform:
        | ((
              element: HTMLElement,
              fromDarkMode: boolean,
              toDarkMode: boolean,
              darkColorHandler: DarkColorHandler
          ) => void)
        | null;

    /**
     * Enabled experimental features
     */
    experimentalFeatures: ExperimentalFeatures[];

    /**
     * Default format of this editor
     */
    defaultFormat: DefaultFormat | null;
}
