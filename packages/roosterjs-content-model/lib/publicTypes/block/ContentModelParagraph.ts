import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockType } from '../enum/BlockType';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import type { CompatibleContentModelBlockType } from '../compatibleEnum/BlockType';

/**
 * Content Model of Paragraph
 */
export interface ContentModelParagraph
    extends ContentModelBlockBase<
        ContentModelBlockType.Paragraph | CompatibleContentModelBlockType.Paragraph
    > {
    /**
     * Segments within this paragraph
     */
    segments: ContentModelSegment[];

    /**
     * Whether this block was created from a block HTML element or just some simple segment between other block elements.
     * True means it doesn't have a related block element, false means it was from a block element
     */
    isImplicit?: boolean;
}
