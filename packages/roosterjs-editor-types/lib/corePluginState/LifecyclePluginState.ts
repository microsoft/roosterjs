import CustomData from '../interface/CustomData';
import DefaultFormat from '../interface/DefaultFormat';

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
     * External content transform function to help do color transform for existing content
     */
    onExternalContentTransform: (htmlIn: HTMLElement) => void;
}
