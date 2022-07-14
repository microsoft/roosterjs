import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of EditImageEvent
 */
export interface EditImageEventData {
    /**
     * The image element that is being changed
     */
    readonly image: HTMLImageElement;

    /**
     * Original src of the image before all editing in current editor session.
     */
    readonly originalSrc: string;

    /**
     * Src of the image before current batch of editing
     * Plugin can check this value to know which image is not used after the change.
     */
    readonly previousSrc: string;

    /**
     * New src of the changed image, in DataUri format.
     * Plugin can modify this string so that the modified one will be set to the image element
     */
    newSrc: string;
}

/**
 * Represents an event that will be fired when an inline image is edited by user, and the src
 * attribute of the image is about to be changed
 */
export default interface EditImageEvent
    extends EditImageEventData,
        BasePluginEvent<PluginEventType.EditImage> {}

/**
 * Represents an event that will be fired when an inline image is edited by user, and the src
 * attribute of the image is about to be changed
 */
export interface CompatibleEditImageEvent
    extends EditImageEventData,
        BasePluginEvent<CompatiblePluginEventType.EditImage> {}
