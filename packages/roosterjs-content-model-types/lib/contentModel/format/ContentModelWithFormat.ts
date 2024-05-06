import type {
    ContentModelFormatBase,
    ReadonlyContentModelFormatBase,
} from './ContentModelFormatBase';

/**
 * Represent a content model with format
 */
export interface ContentModelWithFormat<T extends ContentModelFormatBase> {
    /**
     * Format of this model
     */
    format: T;
}

/**
 * Represent a content model with format (Readonly)
 */
export interface ReadonlyContentModelWithFormat<T extends ReadonlyContentModelFormatBase> {
    /**
     * Format of this model
     */
    readonly format: T;
}
