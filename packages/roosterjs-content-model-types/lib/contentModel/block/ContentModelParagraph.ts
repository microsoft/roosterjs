import type { ContentModelBlockBase, ReadonlyContentModelBlockBase } from './ContentModelBlockBase';
import type {
    ContentModelParagraphDecorator,
    ReadonlyContentModelParagraphDecorator,
} from '../decorator/ContentModelParagraphDecorator';
import type {
    ContentModelSegment,
    ReadonlyContentModelSegment,
} from '../segment/ContentModelSegment';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegmentFormat,
} from '../format/ContentModelSegmentFormat';

/**
 * Common part of Content Model of Paragraph
 */
export interface ContentModelParagraphCommon {
    /**
     * Whether this block was created from a block HTML element or just some simple segment between other block elements.
     * True means it doesn't have a related block element, false means it was from a block element
     */
    isImplicit?: boolean;
}

/**
 * Content Model of Paragraph
 */
export interface ContentModelParagraph
    extends ContentModelParagraphCommon,
        ContentModelBlockBase<'Paragraph'> {
    /**
     * Segments within this paragraph
     */
    segments: ContentModelSegment[];

    /**
     * Segment format on this paragraph. This is mostly used for default format
     */
    segmentFormat?: ContentModelSegmentFormat;

    /**
     * Decorator info for this paragraph, used by heading and P tags
     */
    decorator?: ContentModelParagraphDecorator;
}

/**
 * Content Model of Paragraph (Readonly)
 */
export interface ReadonlyContentModelParagraph
    extends ReadonlyContentModelBlockBase<'Paragraph'>,
        Readonly<ContentModelParagraphCommon> {
    /**
     * Segments within this paragraph
     */
    readonly segments: ReadonlyArray<ReadonlyContentModelSegment>;

    /**
     * Segment format on this paragraph. This is mostly used for default format
     */
    readonly segmentFormat?: ReadonlyContentModelSegmentFormat;

    /**
     * Decorator info for this paragraph, used by heading and P tags
     */
    readonly decorator?: ReadonlyContentModelParagraphDecorator;
}
