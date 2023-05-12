import { ContentModelWithDataset } from '../../publicTypes/format/ContentModelWithDataset';
import { Definition } from 'roosterjs-editor-types';
import { validate } from 'roosterjs-editor-dom';

const EditingInfoDatasetName = 'editingInfo';

/**
 * @internal
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
 * @internal Check if the given model has metadata
 */
export function hasMetadata<T>(model: ContentModelWithDataset<T> | HTMLElement): boolean {
    return !!model.dataset[EditingInfoDatasetName];
}
