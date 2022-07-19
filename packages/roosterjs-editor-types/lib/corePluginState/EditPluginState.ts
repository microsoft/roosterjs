import { GenericContentEditFeature } from '../interface/ContentEditFeature';
import { PluginEvent } from '../event/PluginEvent';

/**
 * The state object for EditPlugin
 */
export default interface EditPluginState {
    /**
     * All content edit features sorted by their keys
     */
    features: Record<number, GenericContentEditFeature<PluginEvent>[]>;
}
