import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Represents format info used by DOM to Content Model conversion
 */
export interface DomToModelFormatContext {
    /**
     * Format of current segment
     */
    segmentFormat: ContentModelSegmentFormat;

    /**
     * Context of list that is currently processing
     */
    listFormat: DomToModelListFormat;

    /**
     * When process table, whether we should always normalize it.
     * This can help persist the size of table that is not created from Content Model
     * @default false
     */
    alwaysNormalizeTable?: boolean;
}
