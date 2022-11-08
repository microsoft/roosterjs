import { DatasetFormat } from './formatParts/DatasetFormat';

/**
 * Represents base format of an element that supports dataset and/or metadata
 */
export interface ContentModelWithDataset<T> {
    /**
     * dataset of this element
     */
    dataset: DatasetFormat;
}
