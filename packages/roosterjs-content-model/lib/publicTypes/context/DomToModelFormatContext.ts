import { ContentModelBlockGroup } from '../block/group/ContentModelBlockGroup';
import { ContentModelListItemLevelFormat } from '../format/ContentModelListItemLevelFormat';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Represents the context object used when do DOM to Content Model conversion and processing a List
 */
export interface DomToModelListFormat {
    /**
     * Current number of each level of current thread
     */
    threadItemCounts: number[];

    /**
     * The list that is currently processing
     */
    listParent?: ContentModelBlockGroup;

    /**
     * Current list type stack
     */
    levels: ContentModelListItemLevelFormat[];
}

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
}
