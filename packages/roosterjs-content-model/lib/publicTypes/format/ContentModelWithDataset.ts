import { DatasetFormat } from './formatParts/DatasetFormat';

/**
 * Represents base format of an element that supports dataset and/or metadata
 */
export type ContentModelWithDataset<T> = {
    /**
     * dataset of this element
     */
    dataset: DatasetFormat;
};
