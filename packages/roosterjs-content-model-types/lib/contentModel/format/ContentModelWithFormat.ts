import type { ContentModelFormatBase } from './ContentModelFormatBase';

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
export interface ReadonlyContentModelWithFormat<T extends ContentModelFormatBase> {
    /**
     * Format of this model
     */
    readonly format: Readonly<T>;
}
