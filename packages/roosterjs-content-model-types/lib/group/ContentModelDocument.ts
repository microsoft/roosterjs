import type { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model document entry point
 */
export interface ContentModelDocument
    extends ContentModelBlockGroupBase<'Document'>,
        Partial<ContentModelWithFormat<ContentModelSegmentFormat>> {}
