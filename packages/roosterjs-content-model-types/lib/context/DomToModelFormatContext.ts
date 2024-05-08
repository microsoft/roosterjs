import type { ContentModelBlockFormatCommon } from '../contentModel/format/ContentModelBlockFormat';
import type { ContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { ContentModelCode } from '../contentModel/decorator/ContentModelCode';
import type { ContentModelLink } from '../contentModel/decorator/ContentModelLink';
import type { ContentModelListLevel } from '../contentModel/decorator/ContentModelListLevel';
import type { ContentModelParagraphDecorator } from '../contentModel/decorator/ContentModelParagraphDecorator';
import type { ContentModelSegmentFormatCommon } from '../contentModel/format/ContentModelSegmentFormat';

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
    levels: ContentModelListLevel[];
}

/**
 * Represents format info used by DOM to Content Model conversion
 */
export interface DomToModelFormatContext {
    /**
     * Format of current block
     */
    blockFormat: ContentModelBlockFormatCommon;

    /**
     * Format of current segment
     */
    segmentFormat: ContentModelSegmentFormatCommon;

    /**
     * Context of list that is currently processing
     */
    listFormat: DomToModelListFormat;
}

/**
 * Represents decorator info used by DOM to Content Model conversion
 */
export interface DomToModelDecoratorContext {
    /**
     * Context of hyper link info
     */
    link: ContentModelLink;

    /**
     * Context of code info
     */
    code: ContentModelCode;

    /**
     * Context for paragraph decorator
     */
    blockDecorator: ContentModelParagraphDecorator;
}
