import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Represents an event object triggered from Editor.setZoomScale() API.
 * Plugins can handle this event when they need to do something for zoom changing.
 *
 */
export interface ZoomChangedEvent extends BasePluginEvent<'zoomChanged'> {
    /**
     * Zoom scale value after this change
     */
    newZoomScale: number;
}
