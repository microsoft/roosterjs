import type {
    ContentModelBlockGroupBase,
    MutableContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
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
    extends Readonly<ContentModelDocumentCommon>,
        ReadonlyContentModelBlockGroupBase<'Document'>,
        Partial<ReadonlyContentModelWithFormat<ContentModelSegmentFormat>> {}

/**
 * Content Model document entry point (Single level mutable)
 */
export interface MutableContentModelDocument
    extends ContentModelDocumentCommon,
        MutableContentModelBlockGroupBase<'Document'>,
        Partial<ContentModelWithFormat<ContentModelSegmentFormat>> {}
