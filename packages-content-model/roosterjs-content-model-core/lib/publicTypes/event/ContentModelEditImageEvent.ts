import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import type { ContentModelImage } from 'roosterjs-content-model-types';

/**
 * Represents an event that will be fired when an inline image is edited by user, and the src
 * attribute of the image is about to be changed
 */
export interface ContentModelEditImageEvent extends ContentModelBasePluginEvent<'editImage'> {
    /**
     * The image element that is being changed
     */
    readonly image: ContentModelImage;

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
