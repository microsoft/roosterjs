import type { MutableMark, ReadonlyMark, ShallowMutableMark } from '../common/MutableMark';
import type { DatasetFormat, ReadonlyDatasetFormat } from './metadata/DatasetFormat';

/**
 * Represents base format of an element that supports dataset and/or metadata
 */
export type ContentModelWithDataset<T> = MutableMark & {
    /**
     * dataset of this element
     */
    dataset: DatasetFormat;
};

/**
 * Represents base format of an element that supports dataset and/or metadata (Readonly)
 */
export type ReadonlyContentModelWithDataset<T> = ReadonlyMark & {
    /**
     * dataset of this element
     */
    readonly dataset: ReadonlyDatasetFormat;
};

/**
 * Represents base format of an element that supports dataset and/or metadata (Readonly)
 */
export type ShallowMutableContentModelWithDataset<T> = ShallowMutableMark & {
    /**
     * dataset of this element
     */
    dataset: DatasetFormat;
};
