import type {
    ContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegmentFormat,
} from '../format/ContentModelSegmentFormat';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Common part of Content Model document entry point
 */
export interface ContentModelDocumentCommon {
    /**
     * Whether the selection in model (if any) is a revert selection (end is before start)
     */
    hasRevertedRangeSelection?: boolean;
}

/**
 * Content Model document entry point
 */
export interface ContentModelDocument
    extends ContentModelDocumentCommon,
        ContentModelBlockGroupBase<'Document'>,
        Partial<ContentModelWithFormat<ContentModelSegmentFormat>> {}

/**
 * Content Model document entry point (Readonly)
 */
export interface ReadonlyContentModelDocument
    extends ReadonlyContentModelBlockGroupBase<'Document'>,
        Partial<ReadonlyContentModelWithFormat<ReadonlyContentModelSegmentFormat>>,
        Readonly<ContentModelDocumentCommon> {}
