import BasePluginEvent from './BasePluginEvent';
import { PendableFormatState } from '../interface/FormatState';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * An event fired when pending format state (bold, italic, underline, ... with collapsed selection) is changed
 */
export default interface PendingFormatStateChangedEvent
    extends BasePluginEvent<PluginEventType.PendingFormatStateChanged> {
    /**
     * The new format state to apply. If null is passed, clear existing pending format state if any
     */
    formatState: PendableFormatState;

    /**
     * A callback to do format change to a temp element. This is used for style-based format such as font and color
     */
    formatCallback?: (element: HTMLElement, isInnerNode?: boolean) => any;
}

/**
 * An event fired when pending format state (bold, italic, underline, ... with collapsed selection) is changed
 */
export interface CompatiblePendingFormatStateChangedEvent
    extends BasePluginEvent<CompatiblePluginEventType.PendingFormatStateChanged> {
    /**
     * The new format state to apply. If null is passed, clear existing pending format state if any
     */
    formatState: PendableFormatState;

    /**
     * A callback to do format change to a temp element. This is used for style-based format such as font and color
     */
    formatCallback?: (element: HTMLElement, isInnerNode?: boolean) => any;
}
