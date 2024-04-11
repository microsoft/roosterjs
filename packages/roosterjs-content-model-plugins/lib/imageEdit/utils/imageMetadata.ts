import {
    EditingInfoDatasetName,
    ImageMetadataFormatDefinition,
    validate,
} from 'roosterjs-content-model-dom';
import type { ImageMetadataFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get metadata object from an HTML element
 * @param element The HTML element to get metadata object from
 * @param definition The type definition of this metadata used for validate this metadata object.
 * If not specified, no validation will be performed and always return whatever we get from the element
 * @param defaultValue The default value to return if the retrieved object cannot pass the validation,
 * or there is no metadata object at all
 * @returns The strong-type metadata object if it can be validated, or null
 */
export function getMetadata(element: HTMLElement): ImageMetadataFormat | null {
    const str = element.dataset[EditingInfoDatasetName];
    let obj: any;

    try {
        obj = str ? JSON.parse(str) : null;
    } catch {}

    if (typeof obj !== 'undefined') {
        if (validate(obj, ImageMetadataFormatDefinition)) {
            return obj;
        }
        return null;
    }
    return null;
}

/**
 * @internal
 * Set metadata object into an HTML element
 * @param element The HTML element to set metadata object to
 * @param metadata The metadata object to set
 * @returns True if metadata is set, otherwise false
 */
export function setMetadata<T>(element: HTMLElement, metadata: ImageMetadataFormat): boolean {
    if (validate(metadata, ImageMetadataFormatDefinition)) {
        element.dataset[EditingInfoDatasetName] = JSON.stringify(metadata);
        return true;
    } else {
        return false;
    }
}

/**
 * @internal
 * Remove metadata from the given element if any
 * @param element The element to remove metadata from
 * @param metadataKey The metadata key to remove, if none provided it will delete all metadata
 */
export function removeMetadata<T>(element: HTMLElement, metadataKey?: keyof ImageMetadataFormat) {
    if (metadataKey) {
        const currentMetadata: ImageMetadataFormat | null = getMetadata(element);
        if (currentMetadata) {
            delete currentMetadata[metadataKey];
            element.dataset[EditingInfoDatasetName] = JSON.stringify(currentMetadata);
        }
    } else {
        delete element.dataset[EditingInfoDatasetName];
    }
}
