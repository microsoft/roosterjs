import { ContentModelWithDataset } from '../../publicTypes/format/ContentModelWithDataset';
import { Definition } from 'roosterjs-editor-types';
import { validate } from 'roosterjs-editor-dom';

const EditingInfoDatasetName = 'editingInfo';

/**
 * @internal
 */
export function updateMetadata<T>(
    model: ContentModelWithDataset<T>,
    callback: (metadata: T | null) => T | null,
    definition?: Definition<T>
) {
    const metadataString = model.dataset[EditingInfoDatasetName];
    let obj: T | null = null;

    try {
        obj = JSON.parse(metadataString) as T;
    } catch {}

    if (definition && !validate(obj, definition)) {
        obj = null;
    }

    obj = callback(obj);

    if (!obj) {
        delete model.dataset[EditingInfoDatasetName];
    } else if (!definition || validate(obj, definition)) {
        model.dataset[EditingInfoDatasetName] = JSON.stringify(obj);
    }
}
