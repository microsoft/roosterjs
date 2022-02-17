import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * Represents an event object triggered from Editor.setZoomScale() API.
 * Plugins can handle this event when they need to do something for zoom changing.
 *
 */
export default interface ZoomChangedEvent extends BasePluginEvent<PluginEventType.ZoomChanged> {
    /**
     * Zoom scale value before this change
     */
    oldZoomScale: number;

    /**
     * Zoom scale value after this change
     */
    newZoomScale: number;
}
