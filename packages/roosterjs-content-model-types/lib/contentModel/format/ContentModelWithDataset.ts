import type { Mutable } from '../common/Mutable';
import type { DatasetFormat, ReadonlyDatasetFormat } from './metadata/DatasetFormat';

/**
 * Represents base format of an element that supports dataset and/or metadata
 */
export type ContentModelWithDataset<T> = Mutable & {
    /**
     * dataset of this element
     */
    dataset: DatasetFormat;
};

/**
 * Represents base format of an element that supports dataset and/or metadata (Readonly)
 */
export type ReadonlyContentModelWithDataset<T> = {
    /**
     * dataset of this element
     */
    readonly dataset: ReadonlyDatasetFormat;
};
