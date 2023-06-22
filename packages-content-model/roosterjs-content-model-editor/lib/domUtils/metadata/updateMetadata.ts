import { ContentModelWithDataset } from 'roosterjs-content-model-types';
import { Definition } from 'roosterjs-editor-types';
import { readMetadata, writeMetadata } from 'roosterjs-content-model/lib';
import { validate } from 'roosterjs-editor-dom';

/**
 * @internal
 * Update metadata of the given model
 * @param model The model to update metadata to
 * @param callback A callback function to update metadata
 * @param definition @optional Metadata definition used for verify the metadata object
 * @returns The metadata object if any, or null
 */
export function updateMetadata<T extends Object>(
    model: ContentModelWithDataset<T>,
    callback?: (metadata: T | null) => T | null,
    definition?: Definition<T>
): T | null {
    let obj = readMetadata(model) as T | null;

    if (definition && !validate(obj, definition)) {
        obj = null;
    }

    let newObj: T | null;

    if (callback) {
        newObj = callback(obj);

        if (definition && !validate(newObj, definition)) {
            newObj = obj;
        }

        writeMetadata(model, newObj);
    } else {
        newObj = obj;
    }

    return newObj;
}
