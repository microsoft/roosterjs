import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Represents format info used by DOM to Content Model conversion
 */
export interface DomToModelFormatContext {
    /**
     * Format of current segment
     */
    segmentFormat: ContentModelSegmentFormat;
}
