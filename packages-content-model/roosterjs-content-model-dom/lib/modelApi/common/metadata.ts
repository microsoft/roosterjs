import { ContentModelWithDataset } from 'roosterjs-content-model-types';

const EditingInfoDatasetName = 'editingInfo';

/**
 * Read metadata object from model
 * @param model The model to read metadata from
 * @returns Metadata object if exist, or null
 */
export function readMetadata<T>(model: ContentModelWithDataset<T>): Object | null {
    const metadataString = model.dataset[EditingInfoDatasetName];
    let obj: Object | null = null;

    try {
        obj = JSON.parse(metadataString);
    } catch {}

    return obj;
}

/**
 * Write metadata to model
 * @param model The model metadata to
 * @param metadata The metadata object, or null. When pass null, existing metadata will be deleted
 */
export function writeMetadata<T>(model: ContentModelWithDataset<T>, metadata: Object | null) {
    if (metadata === null) {
        delete model.dataset[EditingInfoDatasetName];
    } else {
        model.dataset[EditingInfoDatasetName] = JSON.stringify(metadata);
    }
}
