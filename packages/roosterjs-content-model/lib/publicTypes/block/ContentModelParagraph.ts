import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelHeader } from '../decorator/ContentModelHeader';
import { ContentModelSegment } from '../segment/ContentModelSegment';

/**
 * Content Model of Paragraph
 */
export interface ContentModelParagraph extends ContentModelBlockBase<'Paragraph'> {
    /**
     * Segments within this paragraph
     */
    segments: ContentModelSegment[];

    /**
     * Header info for this paragraph if it is a header
     */
    header?: ContentModelHeader;

    /**
     * Whether this block was created from a block HTML element or just some simple segment between other block elements.
     * True means it doesn't have a related block element, false means it was from a block element
     */
    isImplicit?: boolean;
}
