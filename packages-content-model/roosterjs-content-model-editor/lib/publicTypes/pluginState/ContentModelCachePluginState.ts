import { ContentModelParagraph, ContentModelText } from 'roosterjs-content-model-types';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 *
 */
export interface SegmentIndexEntry {
    /**
     *
     */
    paragraph: ContentModelParagraph;

    /**
     *
     */
    segment: ContentModelText | ContentModelText[];
}

/**
 *
 */
export interface ContentModelCachePluginState {
    /**
     *
     */
    nextSequenceNumber: number;

    /**
     *
     */
    index: Record<number, SegmentIndexEntry>;

    /**
     *
     */
    isUpdatingRange: boolean;

    /**
     *
     */
    cachedRangeEx?: SelectionRangeEx | undefined;
}
