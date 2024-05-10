import { validate } from './validate';
import type {
    ContentModelWithDataset,
    Definition,
    ReadonlyContentModel,
} from 'roosterjs-content-model-types';

const EditingInfoDatasetName = 'editingInfo';

/**
 * Retrieve a copy of metadata from a metadata model
 * @param model The model to update metadata to
 * @param definition @optional Metadata definition used for verify the metadata object
 * @returns The metadata object if any, or null
 */
export function retrieveMetadataCopy<T>(
    model: ReadonlyContentModel<ContentModelWithDataset<T>>,
    definition?: Definition<T>
): T | null {
    const metadataString = model.dataset[EditingInfoDatasetName];
    let obj: T | null = null;

    try {
        obj = JSON.parse(metadataString) as T;
    } catch {}

    return definition && !validate(obj, definition) ? null : obj;
}

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
    let obj = retrieveMetadataCopy(model, definition);

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
export function hasMetadata<T>(
    model: ReadonlyContentModel<ContentModelWithDataset<T>> | HTMLElement
): boolean {
    return !!model.dataset[EditingInfoDatasetName];
}
