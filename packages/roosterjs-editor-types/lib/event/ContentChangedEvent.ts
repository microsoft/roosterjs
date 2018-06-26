import ChangeSource from '../enum/ChangeSource';
import PluginEvent from './PluginEvent';

/**
 * Represents a custom PluginEvent for content change
 */
interface ContentChangedEvent extends PluginEvent {
    /**
     * Source of the change
     */
    source: ChangeSource | string;

    /**
     * Optional related data
     */
    data?: any;
}

export default ContentChangedEvent;
