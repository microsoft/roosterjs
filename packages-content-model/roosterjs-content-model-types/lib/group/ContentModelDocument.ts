import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model document entry point
 */
export interface ContentModelDocument
    extends ContentModelBlockGroupBase<'Document'>,
        Partial<ContentModelWithFormat<ContentModelSegmentFormat>> {}
