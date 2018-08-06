import BasePluginEvent from './BasePluginEvent';
import ChangeSource from '../enum/ChangeSource';
import PluginEventType from './PluginEventType';

/**
 * Represents a change to the editor made by another plugin
 */
interface ContentChangedEvent extends BasePluginEvent<PluginEventType.ContentChanged> {
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
