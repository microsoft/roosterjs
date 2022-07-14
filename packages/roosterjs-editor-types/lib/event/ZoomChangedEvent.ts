import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of ZoomChangedEvent
 */
export interface ZoomChangedEventData {
    /**
     * Zoom scale value before this change
     */
    oldZoomScale: number;

    /**
     * Zoom scale value after this change
     */
    newZoomScale: number;
}

/**
 * Represents an event object triggered from Editor.setZoomScale() API.
 * Plugins can handle this event when they need to do something for zoom changing.
 *
 */
export default interface ZoomChangedEvent
    extends ZoomChangedEventData,
        BasePluginEvent<PluginEventType.ZoomChanged> {}

/**
 * Represents an event object triggered from Editor.setZoomScale() API.
 * Plugins can handle this event when they need to do something for zoom changing.
 *
 */
export interface CompatibleZoomChangedEvent
    extends ZoomChangedEventData,
        BasePluginEvent<CompatiblePluginEventType.ZoomChanged> {}
