import { DarkColorHandler, ExperimentalFeatures } from 'roosterjs-editor-types';
import type { CompatibleExperimentalFeatures } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * An editor context interface used by ContentModel PAI
 */
export interface EditorContext {
    /**
     * Whether current content is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Calculate color for dark mode
     * @param lightColor Light mode color
     * @returns Dark mode color calculated from lightColor
     */
    getDarkColor?: (lightColor: string) => string;

    /**
     * Dark model color handler
     */
    darkColorHandler?: DarkColorHandler | null;

    /**
     * Check if the given experimental feature is enabled in the editor
     * @param feature The feature to check
     */
    experimentalFeatures: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];
}
