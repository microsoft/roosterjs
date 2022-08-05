import BasePluginEvent from './BasePluginEvent';
import { PendableFormatState } from '../interface/FormatState';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * An event fired when pending format state (bold, italic, underline, ... with collapsed selection) is changed
 */
export default interface PendingFormatStateChangedEvent
    extends BasePluginEvent<PluginEventType.PendingFormatStateChanged> {
    formatState: PendableFormatState;

    formatCallback?: (element: HTMLElement, isInnerNode?: boolean) => any;
}

/**
 * An event fired when pending format state (bold, italic, underline, ... with collapsed selection) is changed
 */
export interface CompatiblePendingFormatStateChangedEvent
    extends BasePluginEvent<CompatiblePluginEventType.PendingFormatStateChanged> {
    formatState: PendableFormatState;

    formatCallback?: (element: HTMLElement, isInnerNode?: boolean) => any;
}
