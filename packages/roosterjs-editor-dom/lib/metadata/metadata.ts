import validate from './validate';
import { Definition } from 'roosterjs-editor-types';

const MetadataDataSetName = 'editingInfo';

/**
 * Get metadata object from an HTML element
 * @param element The HTML element to get metadata object from
 * @param definition The type definition of this metadata used for validate this metadata object.
 * If not specified, no validation will be performed and always return whatever we get from the element
 * @param defaultValue The default value to return if the retrieved object cannot pass the validation,
 * or there is no metadata object at all
 * @returns The strong-type metadata object if it can be validated, or null
 */
export function getMetadata<T>(
    element: HTMLElement,
    definition?: Definition<T>,
    defaultValue?: T
): T | null {
    const str = element.dataset[MetadataDataSetName];
    let obj: any;

    try {
        obj = str ? JSON.parse(str) : null;
    } catch {}

    if (typeof obj !== 'undefined') {
        if (!definition) {
            return obj as T;
        } else if (validate(obj, definition)) {
            return obj;
        }
    }

    if (defaultValue) {
        return defaultValue;
    } else {
        return null;
    }
}

/**
 * Set metadata object into an HTML element
 * @param element The HTML element to set metadata object to
 * @param metadata The metadata object to set
 * @param def An optional type definition object used for validate this metadata object.
 * If not specified, metadata will be set without validation
 * @returns True if metadata is set, otherwise false
 */
export function setMetadata<T>(element: HTMLElement, metadata: T, def?: Definition<T>): boolean {
    if (!def || validate(metadata, def)) {
        element.dataset[MetadataDataSetName] = JSON.stringify(metadata);
        return true;
    } else {
        return false;
    }
}

/**
 * Remove metadata from the given element if any
 * @param element The element to remove metadata from
 */
export function removeMetadata(element: HTMLElement) {
    delete element.dataset[MetadataDataSetName];
}
