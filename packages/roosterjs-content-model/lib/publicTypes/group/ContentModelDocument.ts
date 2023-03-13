import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model document entry point
 */
export interface ContentModelDocument extends ContentModelBlockGroupBase<'Document'> {
    /**
     * Default segment format of this document
     */
    defaultFormat?: ContentModelSegmentFormat;
}
