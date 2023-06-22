import { ContentModelFormatBase } from './ContentModelFormatBase';

/**
 * Represent a content model with format
 */
export interface ContentModelWithFormat<T extends ContentModelFormatBase> {
    /**
     * Format of this model
     */
    format: T;
}
