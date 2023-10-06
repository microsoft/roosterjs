import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelCode } from '../decorator/ContentModelCode';
import type { ContentModelLink } from '../decorator/ContentModelLink';
import type { ContentModelListLevel } from '../decorator/ContentModelListLevel';
import type { ContentModelParagraphDecorator } from '../decorator/ContentModelParagraphDecorator';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

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
    blockFormat: ContentModelBlockFormat;

    /**
     * Format of current segment
     */
    segmentFormat: ContentModelSegmentFormat;

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
