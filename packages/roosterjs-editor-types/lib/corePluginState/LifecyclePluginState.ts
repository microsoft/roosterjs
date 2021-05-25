import CustomData from '../interface/CustomData';
import DefaultFormat from '../interface/DefaultFormat';
import SelectionPath from '../interface/SelectionPath';
import { ExperimentalFeatures } from '../enum/ExperimentalFeatures';

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
    defaultFormat: DefaultFormat;

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
    onExternalContentTransform: (htmlIn: HTMLElement) => void;

    /**
     * Enabled experimental features
     */
    experimentalFeatures: ExperimentalFeatures[];

    /**
     * Cached document fragment for original content
     */
    shadowEditFragment: DocumentFragment;

    /**
     * Cached selection path for original content
     */
    shadowEditSelectionPath: SelectionPath;
}
