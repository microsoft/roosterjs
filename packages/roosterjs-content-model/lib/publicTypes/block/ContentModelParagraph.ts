import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockWithCache } from './ContentModelBlockWithCache';
import { ContentModelParagraphDecorator } from '../decorator/ContentModelParagraphDecorator';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Paragraph
 */
export interface ContentModelParagraph
    extends ContentModelBlockBase<'Paragraph'>,
        ContentModelBlockWithCache {
    /**
     * Segments within this paragraph
     */
    segments: ContentModelSegment[];

    /**
     * Segment format on this paragraph. This is mostly used for default format
     */
    segmentFormat?: ContentModelSegmentFormat;

    /**
     * Header info for this paragraph if it is a header
     */
    decorator?: ContentModelParagraphDecorator;

    /**
     * Whether this block was created from a block HTML element or just some simple segment between other block elements.
     * True means it doesn't have a related block element, false means it was from a block element
     */
    isImplicit?: boolean;

    /**
     * Whether we can apply "font-size: 0" to this paragraph. When set to true, we will check if there is no text segment inside,
     * and apply "font-size: 0" to the container element
     */
    zeroFontSize?: boolean;
}
