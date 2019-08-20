import BasePluginEvent from './BasePluginEvent';
import { PendableFormatState } from '../interface/FormatState';
import { PluginEventType } from './PluginEventType';

/**
 * An event fired when pending format state (bold, italic, underline, ... with collapsed selection) is changed
 */
export default interface PendingFormatStateChangedEvent
    extends BasePluginEvent<PluginEventType.PendingFormatStateChanged> {
    formatState: PendableFormatState;
}
