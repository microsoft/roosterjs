import { ContentModelWithDataset } from 'roosterjs-content-model-types';
import { Definition } from 'roosterjs-editor-types';
import { validate } from 'roosterjs-editor-dom';

const EditingInfoDatasetName = 'editingInfo';

/**
 * Update metadata of the given model
 * @param model The model to update metadata to
 * @param callback A callback function to update metadata
 * @param definition @optional Metadata definition used for verify the metadata object
 * @returns The metadata object if any, or null
 */
export function updateMetadata<T>(
    model: ContentModelWithDataset<T>,
    callback?: (metadata: T | null) => T | null,
    definition?: Definition<T>
): T | null {
    const metadataString = model.dataset[EditingInfoDatasetName];
    let obj: T | null = null;

    try {
        obj = JSON.parse(metadataString) as T;
    } catch {}

    if (definition && !validate(obj, definition)) {
        obj = null;
    }

    if (callback) {
        obj = callback(obj);

        if (!obj) {
            delete model.dataset[EditingInfoDatasetName];
        } else if (!definition || validate(obj, definition)) {
            model.dataset[EditingInfoDatasetName] = JSON.stringify(obj);
        }
    }

    return obj;
}

/**
 * Check if the given model has metadata
 * @param model The content model to check
 */
export function hasMetadata<T>(model: ContentModelWithDataset<T> | HTMLElement): boolean {
    return !!model.dataset[EditingInfoDatasetName];
}
