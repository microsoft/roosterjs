import BasePluginEvent from './BasePluginEvent';
import { ChangeSource } from '../enum/ChangeSource';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatibleChangeSource } from '../compatibleEnum/ChangeSource';

/**
 * Represents a change to the editor made by another plugin
 */
export default interface ContentChangedEvent
    extends BasePluginEvent<PluginEventType.ContentChanged> {
    /**
     * Source of the change
     */
    source: ChangeSource | CompatibleChangeSource | string;

    /**
     * Optional related data
     */
    data?: any;
}
