import { validate } from './validate';
import type {
    Definition,
    ReadonlyContentModelWithDataset,
    ShallowMutableContentModelWithDataset,
} from 'roosterjs-content-model-types';

const EditingInfoDatasetName = 'editingInfo';

/**
 * Retrieve metadata from the given model.
 * @param model The Content Model to retrieve metadata from
 * @param definition Definition of this metadata type, used for validate the metadata object
 * @returns Metadata of the model, or null if it does not contain a valid metadata
 */
export function getMetadata<T>(
    model: ReadonlyContentModelWithDataset<T>,
    definition?: Definition<T>
): T | null {
    const metadataString = model.dataset[EditingInfoDatasetName];
    let obj: Object | null = null;

    try {
        obj = JSON.parse(metadataString);
    } catch {}

    return !definition || validate(obj, definition) ? (obj as T) : null;
}

/**
 * Update metadata of the given model
 * @param model The model to update metadata to
 * @param callback A callback function to update metadata
 * @param definition @optional Metadata definition used for verify the metadata object
 * @returns The metadata object if any, or null
 */
export function updateMetadata<T>(
    model: ShallowMutableContentModelWithDataset<T>,
    callback?: (metadata: T | null) => T | null,
    definition?: Definition<T>
): T | null {
    let obj = getMetadata(model, definition);

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
export function hasMetadata<T>(model: ReadonlyContentModelWithDataset<T> | HTMLElement): boolean {
    return !!model.dataset[EditingInfoDatasetName];
}
