import CustomData from '../interface/CustomData';
import DefaultFormat from '../interface/DefaultFormat';
import SelectionPath from '../interface/SelectionPath';
import { ExperimentalFeatures } from '../enum/ExperimentalFeatures';
import type { CompatibleExperimentalFeatures } from '../compatibleEnum/ExperimentalFeatures';

/**
 * The state object for LifecyclePlugin
 */
export default interface LifecyclePluginState {
    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

    /**
     * Default format of this editor
     */
    defaultFormat: DefaultFormat | null;

    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Calculate dark mode color from light mode color
     */
    getDarkColor: (lightColor: string) => string;

    /**
     * External content transform function to help do color transform for existing content
     */
    onExternalContentTransform: ((htmlIn: HTMLElement) => void) | null;

    /**
     * Enabled experimental features
     */
    experimentalFeatures: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];

    /**
     * Cached document fragment for original content
     */
    shadowEditFragment: DocumentFragment | null;

    /**
     * Cached entity pairs for original content
     */
    shadowEditEntities: Record<string, HTMLElement> | null;

    /**
     * Cached selection path for original content
     */
    shadowEditSelectionPath: SelectionPath | null;

    /**
     * Cached table selection path for original content
     */
    shadowEditTableSelectionPath: SelectionPath[] | null;

    /**
     * Cached image selection path for original content
     */
    shadowEditImageSelectionPath: SelectionPath[] | null;
}
