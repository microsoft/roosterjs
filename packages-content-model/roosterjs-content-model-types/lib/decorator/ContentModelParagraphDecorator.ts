import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Represent decorator for a paragraph in Content Model
 * A decorator of paragraph can represent a heading, or a P tag that act likes a paragraph but with some extra format info
 * since heading is also a kind of paragraph, with some extra information
 */
export interface ContentModelParagraphDecorator
    extends ContentModelWithFormat<ContentModelSegmentFormat> {
    /**
     * Tag name of this paragraph
     */
    tagName: string;
}
