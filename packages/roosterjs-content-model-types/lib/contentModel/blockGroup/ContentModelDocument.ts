import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model document entry point
 */
export interface ContentModelDocument
    extends ContentModelBlockGroupBase<'Document'>,
        Partial<ContentModelWithFormat<ContentModelSegmentFormat>> {
    /**
     * Whether the selection in model (if any) is a revert selection (end is before start)
     */
    hasRevertedRangeSelection?: boolean;
}

/**
 * Content Model document entry point (Readonly)
 */
export type ReadonlyContentModelDocument = ReadonlyContentModel<ContentModelDocument>;
