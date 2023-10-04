import { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * Represents an event object triggered from Editor.setZoomScale() API.
 * Plugins can handle this event when they need to do something for zoom changing.
 *
 */
export default interface ContentModelZoomChangedEvent
    extends ContentModelBasePluginEvent<'zoomChanged'> {
    /**
     * Zoom scale value before this change
     */
    oldZoomScale: number;

    /**
     * Zoom scale value after this change
     */
    newZoomScale: number;
}
