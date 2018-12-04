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
     * A snapshot of editor content before this event is fired.
     * Undo plugin will use this value to compare with current value to decide whether there is new content.
     * Plugin can overwrite this value to suppress undo to be added by Undo plugin
     */
    lastSnapshot: string;

    /**
     * Optional related data
     */
    data?: any;
}

export default ContentChangedEvent;
